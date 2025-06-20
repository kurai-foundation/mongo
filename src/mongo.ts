import { MongoClient, MongoClientOptions } from "mongodb"
import MongoController from "~/mongo-controller"

export const mongo = {
  createClient(connectUri: string, databaseName: string, options?: MongoClientOptions) {
    const client = new MongoClient(connectUri, options)

    return new MongoController(client, databaseName)
  },

  createInstance(connectUri: string, options?: MongoClientOptions) {
    const client = new MongoClient(connectUri, options)

    return {
      createClient(databaseName: string) {
        return new MongoController(client, databaseName)
      }
    }
  },

  withClient(mongoClient: MongoClient, databaseName: string) {
    return new MongoController(mongoClient, databaseName)
  },

  createMongoClient(connectUri: string, options?: MongoClientOptions) {
    return new MongoClient(connectUri, options)
  }
}