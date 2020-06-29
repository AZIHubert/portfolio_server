const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');


const { SECRET, SECRET2 } = require('./config');

const port = 8000;
const { MONGODB } = require('./config.js');

const typeDefs = require('./typeDefs/rootTypeDef.js');
const resolvers = require('./resolvers/rootResolver.js');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { SECRET, SECRET2 }
});
 
const app = express();
server.applyMiddleware({ app });

const connect = async () => {
    try{
        await mongoose.connect(MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to mongo ATLAS');
        app.listen({ port }, () => console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`));
    } catch(err) {
        console.log(err);
    }
};

connect();