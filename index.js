const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

const { MONGODB, SECRET, SECRET2 } = require('./config');

const port = process.env.PORT || 8000;

const typeDefs = require('./typeDefs/rootTypeDef.js');
const resolvers = require('./resolvers/rootResolver.js');

const { addUser } = require('./util/addUser');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({
        SECRET,
        SECRET2,
        user: req.user
    })
});
 
const app = express();
app.use(addUser);
server.applyMiddleware({ app });

const connect = async () => {
    try{
        await mongoose.connect(MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Connected to mongo ATLAS');
        app.listen({ port }, () => console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`));
    } catch(err) {
        console.log(err);
    }
};

connect();