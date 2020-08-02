module.exports = `
    type Block{
        _id: ID!
        part: Part!
        index: Int!
        size: Int!
        contents: [Content]
    }

    input BlockFilter {
        _id: StringFilter
        part: StringFilter
        index: IntFilter
        size: IntFilter
        contents: ArrayStringsFilter
        
        and: [BlockFilter!]
        or: [BlockFilter!]
        not: BlockFilter
    }

    enum BlockSortableField {
        index
        size
    }
    input BlockSort {
        field: BlockSortableField
        order: SortOrder = ASC
    }

    type BlockResponse {
        OK: Boolean!
        block: Block
        errors: [Error!]
    }
    type MoveBlockResponse {
        OK: Boolean
        blocks: [Block!]
        errors: [Error!]
    }

    type Query{
        getBlocks(
            skip: Int
            limit: Int
            sort: [BlockSort!]
            filter: BlockFilter
        ): [Block!]
        getBlock(blockId: ID): Block!
    }
    type Mutation{
        createBlock(partId: ID! size: Int!): BlockResponse!
        updateBlock(blockId: ID! size: Int!): BlockResponse!
        moveBlock(blockId: ID! index: Int!): MoveBlockResponse!
        deleteBlock(blockId: ID!): Boolean!
    }
`;