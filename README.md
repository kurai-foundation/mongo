# Mongo Abstraction Layer

Abstraction layer for Mongo database

## Installation

```bash
npm install @kurai-io/mongo
# or
yarn add @kurai-io/mongo
```


## Usage

### Create instance and client

```typescript
// foundation.ts
import { mongo } from "@kurai-io/mongo"

const instance = mongo.createInstance("mongo://...")

const client = instance.createClient("db1")

// You can create clients even without instance

const client2 = mongo.createClient("mongo://", "db1")
```

### Connecting and disconnecting
```typescript
import { client, instance } from "./foundation.ts"

await client.connect()

// Or you can perform connection in a in-line manner

const inlineClient = await instance.createClient("db2").connect()

// Disconnect from current instance
client.disconnect()
```

### Interacting with database
```typescript
import { client, instance } from "./foundation.ts"

const col = client.collection<T>("myCollection") // => mongo Collection

// Now you can interact with "col" like
// with default mongo collection
```

## License

You can copy and paste the MIT license summary from below.

```text
MIT License

Copyright (c) 2022 Kurai Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

