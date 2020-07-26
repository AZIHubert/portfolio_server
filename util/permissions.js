const { base } = require("../models/Type");

const createResolver = resolver => {
    const baseResolver = resolver;
    baseResolver.createResolver = childResolver => {
        const newResolver = async (parent, args, context, info) => {
            await resolver(parent, args, context, info);
            return childResolver(parent, args, context, info);
        }
        return createResolver(newResolver);
    }
    return baseResolver;
};

const unrequiresAuth = createResolver((parent, args, context) => {
    if(context.user){
        throw new Error('Already authenticated');
    }
});

const requiresAuth = createResolver((parent, args, context) => {
    if(!context.user || !context.user._id){
        throw new Error('Not authenticated');
    }
});

const requiresActive = requiresAuth.createResolver((parent, args, { user }) => {
    if(!user.isActive){
        throw new Error('This account is not active');
    }
});

const requiresAdmin = requiresActive.createResolver((parent, args, { user }) => {
    if(!user.isAdmin){
        throw new Error('Requires admin access');
    }
});

module.exports.unrequiresAuth = unrequiresAuth;
module.exports.requiresAuth = requiresAuth;
module.exports.requiresActive = requiresActive;
module.exports.requiresAdmin = requiresAdmin;
