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

    type blockResponse{
        OK: Boolean!
        block: Block
        errors: [Error!]
    }

    type Query{
        getBlocks(skip: Int, limit: Int, sort: [BlockSort!], filter: BlockFilter): [Block!]
        getBlock(blockId: ID): Block!
    }
    type Mutation{
        createBlock(partId: ID! size: Int!): blockResponse!
        updateBlock(blockId: ID! size: Int!): blockResponse!
        moveBlock(blockId: ID! index: Int!): [Block!]!
        deleteBlock(blockId: ID!): Boolean!
    }
`;