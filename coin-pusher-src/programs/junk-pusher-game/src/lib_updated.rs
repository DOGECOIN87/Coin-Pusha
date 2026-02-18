use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

declare_id!("11111111111111111111111111111111");

// JUNK Token: BgvprjyRDq1erzQocRTmLPBzMuEmcARg64LE9eGX9XRF
// TRASHCOIN Token: GNFqCqaU9R2jas4iaKEFZM5hiX5AHxBL7rPHTCpX5T6z

#[program]
pub mod coin_pusher_game {
    use super::*;

    /// Initialize a new game session for a player
    pub fn initialize_game(
        ctx: Context<InitializeGame>,
        initial_balance: u64,
    ) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        
        game_state.player = ctx.accounts.player.key();
        game_state.score = 0;
        game_state.balance = initial_balance;
        game_state.net_profit = 0i64;
        game_state.total_coins_collected = 0;
        game_state.trashcoins_collected = 0;
        game_state.bump = ctx.bumps.game_state;
        game_state.created_at = Clock::get()?.unix_timestamp;
        game_state.last_updated = Clock::get()?.unix_timestamp;

        emit!(GameInitialized {
            player: ctx.accounts.player.key(),
            initial_balance,
            timestamp: game_state.created_at,
        });

        Ok(())
    }

    /// Record a coin drop (costs 1 JUNK)
    pub fn drop_coin(
        ctx: Context<DropCoin>,
    ) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        
        // Transfer 1 JUNK from player to program vault
        let amount = 1_000_000u64; // 1 JUNK (6 decimals)
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.player_junk_account.to_account_info(),
            to: ctx.accounts.vault_junk_account.to_account_info(),
            authority: ctx.accounts.player.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, amount)?;

        // Update game state
        game_state.balance = game_state.balance.saturating_sub(1);
        game_state.net_profit -= 1;
        game_state.last_updated = Clock::get()?.unix_timestamp;

        emit!(CoinDropped {
            player: ctx.accounts.player.key(),
            cost: 1,
            new_balance: game_state.balance,
            timestamp: game_state.last_updated,
        });

        Ok(())
    }

    /// Record a coin collection (player wins)
    pub fn collect_coin(
        ctx: Context<CollectCoin>,
        is_trashcoin: bool,
    ) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        let now = Clock::get()?.unix_timestamp;

        let reward = if is_trashcoin { 5 } else { 1 };

        // Update game state
        game_state.score = game_state.score.saturating_add(reward);
        game_state.balance = game_state.balance.saturating_add(reward);
        game_state.net_profit += reward as i64;
        game_state.total_coins_collected = game_state.total_coins_collected.saturating_add(1);
        
        if is_trashcoin {
            game_state.trashcoins_collected = game_state.trashcoins_collected.saturating_add(1);
        }
        
        game_state.last_updated = now;

        emit!(CoinCollected {
            player: ctx.accounts.player.key(),
            amount: reward,
            is_trashcoin,
            new_balance: game_state.balance,
            timestamp: now,
        });

        Ok(())
    }

    /// Bump the machine (costs 50 JUNK)
    pub fn bump_machine(
        ctx: Context<BumpMachine>,
    ) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        let now = Clock::get()?.unix_timestamp;

        // Check for rate limiting (prevent rapid-fire bump spam)
        require!(
            now.saturating_sub(game_state.last_updated) >= 1,
            GameError::TooManyRequests
        );

        // Transfer 50 JUNK from player to program vault
        let amount = 50_000_000u64; // 50 JUNK (6 decimals)
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.player_junk_account.to_account_info(),
            to: ctx.accounts.vault_junk_account.to_account_info(),
            authority: ctx.accounts.player.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, amount)?;

        // Update game state
        game_state.balance = game_state.balance.saturating_sub(50);
        game_state.net_profit -= 50;
        game_state.last_updated = now;

        emit!(MachineBumped {
            player: ctx.accounts.player.key(),
            cost: 50,
            new_balance: game_state.balance,
            timestamp: now,
        });

        Ok(())
    }

    /// Award TRASHCOIN to player (rare reward)
    pub fn award_trashcoin(
        ctx: Context<AwardTrashcoin>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, GameError::InvalidAmount);

        // Transfer TRASHCOIN from vault to player
        let seeds = &[
            b"vault".as_ref(),
            &[ctx.bumps.vault_authority],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_trashcoin_account.to_account_info(),
            to: ctx.accounts.player_trashcoin_account.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        token::transfer(cpi_ctx, amount)?;

        emit!(TrashcoinAwarded {
            player: ctx.accounts.player.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Reset game state
    pub fn reset_game(ctx: Context<ResetGame>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        
        game_state.score = 0;
        game_state.balance = 100;
        game_state.net_profit = 0;
        game_state.total_coins_collected = 0;
        game_state.trashcoins_collected = 0;
        game_state.last_updated = Clock::get()?.unix_timestamp;

        emit!(GameReset {
            player: ctx.accounts.player.key(),
            timestamp: game_state.last_updated,
        });

        Ok(())
    }
}

// ============================================================================
// Accounts
// ============================================================================

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(
        init,
        payer = player,
        space = 8 + std::mem::size_of::<GameState>(),
        seeds = [b"game_state", player.key().as_ref()],
        bump,
    )]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DropCoin<'info> {
    #[account(
        mut,
        seeds = [b"game_state", player.key().as_ref()],
        bump = game_state.bump,
        has_one = player,
    )]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_junk_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_junk_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CollectCoin<'info> {
    #[account(
        mut,
        seeds = [b"game_state", player.key().as_ref()],
        bump = game_state.bump,
        has_one = player,
    )]
    pub game_state: Account<'info, GameState>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct BumpMachine<'info> {
    #[account(
        mut,
        seeds = [b"game_state", player.key().as_ref()],
        bump = game_state.bump,
        has_one = player,
    )]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_junk_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_junk_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AwardTrashcoin<'info> {
    #[account(
        seeds = [b"vault"],
        bump,
    )]
    /// CHECK: PDA authority for vault
    pub vault_authority: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault_trashcoin_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub player_trashcoin_account: Account<'info, TokenAccount>,
    pub player: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ResetGame<'info> {
    #[account(
        mut,
        seeds = [b"game_state", player.key().as_ref()],
        bump = game_state.bump,
        has_one = player,
    )]
    pub game_state: Account<'info, GameState>,
    pub player: Signer<'info>,
}

// ============================================================================
// State
// ============================================================================

#[account]
pub struct GameState {
    pub player: Pubkey,
    pub score: u64,
    pub balance: u64,
    pub net_profit: i64,
    pub total_coins_collected: u64,
    pub trashcoins_collected: u64,
    pub created_at: i64,
    pub last_updated: i64,
    pub bump: u8,
}

// ============================================================================
// Events
// ============================================================================

#[event]
pub struct GameInitialized {
    pub player: Pubkey,
    pub initial_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct CoinDropped {
    pub player: Pubkey,
    pub cost: u64,
    pub new_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct CoinCollected {
    pub player: Pubkey,
    pub amount: u64,
    pub is_trashcoin: bool,
    pub new_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct MachineBumped {
    pub player: Pubkey,
    pub cost: u64,
    pub new_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct TrashcoinAwarded {
    pub player: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct GameReset {
    pub player: Pubkey,
    pub timestamp: i64,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum GameError {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Too many requests - rate limited")]
    TooManyRequests,
    #[msg("Unauthorized")]
    Unauthorized,
}
