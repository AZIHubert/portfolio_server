module.exports = `
    type Block{
        _id: ID!
        part: Part!
        index: Int!
        size: Int!
        contents: [Content]
    }
`;