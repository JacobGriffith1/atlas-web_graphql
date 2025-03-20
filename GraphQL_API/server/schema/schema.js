const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLScalarType } = require('graphql');

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        weight: { type: GraphQLInt },
        description: { type: GraphQLString }
    }
});

const RootQuery = new GraphQLObjectType({
    fields: {
        task: {
            type: TaskType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                // Placeholder for fetching task from DB
                return {}; // Replace with DB logic later
            }
        }
    }
});

module.exports = TaskType;
module.exports = RootQuery;