use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod junk_pusher_game {
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

    /// Record a coin collection event (bump action on physical machine)
    pub fn record_coin_collection(
        ctx: Context<RecordCoinCollection>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, GameError::InvalidAmount);

        let game_state = &mut ctx.accounts.game_state;
        let now = Clock::get()?.unix_timestamp;

        // Check for rate limiting (prevent rapid-fire bump spam)
        require!(
            now.saturating_sub(game_state.last_updated) >= 1,
            GameError::TooManyRequests
        );

        // Update game state
        game_state.balance = game_state.balance.saturating_add(amount);
        game_state.total_coins_collected = game_state.total_coins_collected.saturating_add(1);
        game_state.last_updated = now;

        // Update net profit (assuming initial balance of 100)
        let initial = 100u64;
        game_state.net_profit = game_state.balance.saturating_sub(initial) as i64;

        emit!(CoinCollected {
            player: ctx.accounts.player.key(),
            amount,
            new_balance: game_state.balance,
            timestamp: now,
        });

        Ok(())
    }

    /// Record player's score
    pub fn record_score(
        ctx: Context<RecordScore>,
        score: u64,
    ) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        let now = Clock::get()?.unix_timestamp;

        game_state.score = score;
        game_state.last_updated = now;

        emit!(ScoreRecorded {
            player: ctx.accounts.player.key(),
            score,
            timestamp: now,
        });

        Ok(())
    }

    /// Deposit SOL into game balance
    pub fn deposit_balance(
        ctx: Context<DepositBalance>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, GameError::InvalidAmount);

        // Transfer SOL from player to game state account
        let player_key = ctx.accounts.player.key();
        let game_state_key = ctx.accounts.game_state.key();

        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &player_key,
            &game_state_key,
            amount,
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.player.to_account_info(),
                ctx.accounts.game_state.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let game_state = &mut ctx.accounts.game_state;
        game_state.balance = game_state.balance.saturating_add(amount);
        game_state.last_updated = Clock::get()?.unix_timestamp;

        emit!(BalanceDeposited {
            player: player_key,
            amount,
            new_balance: game_state.balance,
        });

        Ok(())
    }

    /// Withdraw balance from game
    pub fn withdraw_balance(
        ctx: Context<WithdrawBalance>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, GameError::InvalidAmount);
        require!(ctx.accounts.game_state.balance >= amount, GameError::InsufficientBalance);

        let player_key = ctx.accounts.player.key();
        let game_state_key = ctx.accounts.game_state.key();
        let bump = ctx.accounts.game_state.bump;

        // Transfer SOL from program to player
        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &game_state_key,
            &player_key,
            amount,
        );

        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                ctx.accounts.game_state.to_account_info(),
                ctx.accounts.player.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[b"game_state", player_key.as_ref(), &[bump]]],
        )?;

        let game_state = &mut ctx.accounts.game_state;
        game_state.balance = game_state.balance.saturating_sub(amount);
        game_state.last_updated = Clock::get()?.unix_timestamp;

        emit!(BalanceWithdrawn {
            player: player_key,
            amount,
            new_balance: game_state.balance,
        });

        Ok(())
    }

    /// Reset game state (for demo/testing)
    pub fn reset_game(ctx: Context<ResetGame>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        
        game_state.score = 0;
        game_state.balance = 100;
        game_state.net_profit = 0;
        game_state.total_coins_collected = 0;
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
pub struct RecordCoinCollection<'info> {
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
pub struct RecordScore<'info> {
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
pub struct DepositBalance<'info> {
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawBalance<'info> {
    #[account(
        mut,
        seeds = [b"game_state", player.key().as_ref()],
        bump = game_state.bump,
        has_one = player,
    )]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
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
pub struct CoinCollected {
    pub player: Pubkey,
    pub amount: u64,
    pub new_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct ScoreRecorded {
    pub player: Pubkey,
    pub score: u64,
    pub timestamp: i64,
}

#[event]
pub struct BalanceDeposited {
    pub player: Pubkey,
    pub amount: u64,
    pub new_balance: u64,
}

#[event]
pub struct BalanceWithdrawn {
    pub player: Pubkey,
    pub amount: u64,
    pub new_balance: u64,
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
