import { Db, MongoClient } from "mongodb"

export enum ConnectionStatus {
  /** The controller is currently connected to the database */
  Connected,
  /** The controller is currently disconnected from the database */
  Disconnected
}

/**
 * Controller for managing MongoDB connections and operations.
 */
export default class MongoController {
  private _database?: Db

  /**
   * Tracks the current connection status.
   * @default ConnectionStatus.Disconnected
   * @private
   */
  private _connectionStatus: ConnectionStatus = ConnectionStatus.Disconnected

  constructor(public readonly mongoClient: MongoClient, private readonly dbName: string) {}

  /**
   * Gets the current connection status.
   */
  public get connectionStatus(): ConnectionStatus {
    return this._connectionStatus
  }

  /**
   * Gets the name of the configured database.
   */
  public get databaseName(): string | null {
    return this.mongoClient.db.name || null
  }

  /**
   * Gets the current database instance, if connected.
   */
  public get db(): Db | undefined {
    return this._database
  }

  /**
   * Gets the current database instance, cast as non-undefined.
   * Use with caution; throws if not connected.
   */
  public get unsafeDB(): Db {
    return this._database as Db
  }

  /**
   * Ensures that there is an active connection to the database.
   * @throws Error if not connected
   */
  public checkConnection(): void {
    if (this._connectionStatus !== ConnectionStatus.Connected) {
      throw new Error("Not connected to database")
    }
  }

  /**
   * Disconnects from the MongoDB server.
   * If already disconnected, does nothing.
   * @returns promise that resolves to true if disconnection succeeded or was unnecessary,
   * or false if an error occurred during client.close()
   */
  public async disconnect(): Promise<boolean> {
    if (this._connectionStatus === ConnectionStatus.Disconnected) {
      return true
    }

    const result = await this.mongoClient.close().catch(() => null)
    if (result === null) {
      return false
    }

    this._connectionStatus = ConnectionStatus.Disconnected

    return true
  }

  /**
   * Connects to the MongoDB server and selects the database.
   * If already connected, does nothing.
   */
  public async connect(): Promise<this> {
    if (this._connectionStatus === ConnectionStatus.Connected) return this

    const result = await this.mongoClient.connect().catch(() => null)
    if (!result) throw new Error("Cannot connect to database")

    this._database = this.mongoClient.db(this.dbName)
    this._connectionStatus = ConnectionStatus.Connected

    return this
  }

  /**
   * Retrieves a collection from the connected database.
   * @typeParam T shape of the documents in the collection
   * @param name name of the collection to access
   * @returns MongoDB Collection instance
   * @throws Error if not connected
   */
  public collection<T extends object = any>(name: string) {
    this.checkConnection()
    return this.unsafeDB.collection<T>(name)
  }
}
