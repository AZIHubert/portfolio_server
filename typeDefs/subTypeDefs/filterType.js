module.exports = `
    input StringFilter {
        eq: String
        ne: String
        in: [String!]
        nin: [String!]
        contains: String
    }
    input IntFilter {
        eq: Int
        ne: Int
        gt: Int
        gte: Int
        lt: Int
        lte: Int
        in: [Int!]
        nin: [Int!]
    }
    input ArrayStringsFilter {
        eq: String
        nin: String
    }
`;