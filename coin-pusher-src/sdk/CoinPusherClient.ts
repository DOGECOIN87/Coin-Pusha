/**
 * Generated Client SDK for Coin Pusher Game Solana Program
 * Auto-generated from IDL
 */

import { PublicKey, TransactionInstruction, SystemProgram, Keypair, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import IDL from '../idl/coin-pusher-game.json';

export const PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

export interface InitializeGameParams {
  initialBalance: number;
}

export interface RecordCoinCollectionParams {
  amount: number;
}

export interface RecordScoreParams {
  score: number;
}

export interface DepositBalanceParams {
  amount: number;
}

export interface WithdrawBalanceParams {
  amount: number;
}

/**
 * Coin Pusher Game Program Client
 */
export class CoinPusherClient {
  private program: Program;

  constructor(provider: AnchorProvider) {
    this.program = new Program(IDL as Idl, PROGRAM_ID, provider);
  }

  /**
   * Derive the game state PDA for a player
   */
  static async getGameStatePDA(
    playerAddress: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('game_state'), playerAddress.toBuffer()],
      programId
    );
  }

  /**
   * Initialize game session for a player
   */
  async initializeGame(
    player: Keypair,
    params: InitializeGameParams
  ): Promise<TransactionInstruction> {
    const [gameStatePDA] = await CoinPusherClient.getGameStatePDA(player.publicKey);

    return this.program.instruction.initializeGame(params.initialBalance, {
      accounts: {
        gameState: gameStatePDA,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    });
  }

  /**
   * Record a coin collection (bump action)
   */
  async recordCoinCollection(
    player: Keypair,
    params: RecordCoinCollectionParams
  ): Promise<TransactionInstruction> {
    const [gameStatePDA] = await CoinPusherClient.getGameStatePDA(player.publicKey);

    return this.program.instruction.recordCoinCollection(params.amount, {
      accounts: {
        gameState: gameStatePDA,
        player: player.publicKey,
      },
    });
  }

  /**
   * Record player score
   */
  async recordScore(
    player: Keypair,
    params: RecordScoreParams
  ): Promise<TransactionInstruction> {
    const [gameStatePDA] = await CoinPusherClient.getGameStatePDA(player.publicKey);

    return this.program.instruction.recordScore(params.score, {
      accounts: {
        gameState: gameStatePDA,
        player: player.publicKey,
      },
    });
  }

  /**
   * Deposit SOL into game balance
   */
  async depositBalance(
    player: Keypair,
    params: DepositBalanceParams
  ): Promise<TransactionInstruction> {
    const [gameStatePDA] = await CoinPusherClient.getGameStatePDA(player.publicKey);

    return this.program.instruction.depositBalance(params.amount, {
      accounts: {
        gameState: gameStatePDA,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });
  }

  /**
   * Withdraw balance from game
   */
  async withdrawBalance(
    player: Keypair,
    params: WithdrawBalanceParams
  ): Promise<TransactionInstruction> {
    const [gameStatePDA] = await CoinPusherClient.getGameStatePDA(player.publicKey);

    return this.program.instruction.withdrawBalance(params.amount, {
      accounts: {
        gameState: gameStatePDA,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });
  }

  /**
   * Reset game state
   */
  async resetGame(player: Keypair): Promise<TransactionInstruction> {
    const [gameStatePDA] = await CoinPusherClient.getGameStatePDA(player.publicKey);

    return this.program.instruction.resetGame({
      accounts: {
        gameState: gameStatePDA,
        player: player.publicKey,
      },
    });
  }

  /**
   * Fetch game state for a player
   */
  async getGameState(playerAddress: PublicKey) {
    const [gameStatePDA] = await CoinPusherClient.getGameStatePDA(playerAddress);

    try {
      const state = await this.program.account.gameState.fetch(gameStatePDA);
      return state;
    } catch (error) {
      console.error('Failed to fetch game state:', error);
      return null;
    }
  }

  /**
   * Subscribe to game state changes for a player
   */
  onGameStateChange(
    playerAddress: PublicKey,
    callback: (state: any) => void
  ): number {
    const [gameStatePDA] = CoinPusherClient.getGameStatePDA(playerAddress);

    return this.program.account.gameState.subscribe(gameStatePDA, (state) => {
      callback(state);
    });
  }

  /**
   * Unsubscribe from game state changes
   */
  unsubscribeFromGameState(subscriptionId: number) {
    this.program.account.gameState.unsubscribe(subscriptionId);
  }
}

export default CoinPusherClient;
