module.exports = `
    input StringFilter {
        eq: String
        contains: String
    }
    input IntFilter {
        eq: Int
        gt: Int
        gte: Int
        lt: Int
        lte: Int
    }
    input ArrayStringsFilter {
        eq: String
        nin: String
    }
`;