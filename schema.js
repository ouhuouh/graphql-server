const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");


//1. Add name and age fields to CustomerType
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: {type: GraphQLString},
  })
}
);

// Root Query - baseline for other queries and object types
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {type: GraphQLString},
      },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/customers/${args.id}`)
          .then(res => res.data);
      }
    },
    //2. Add customers field for all customers query
  }
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
      },
      resolve(parentValue, args){
        return axios.post("http://localhost:3000/customers/", {
          name: args.name,
          age: args.age
        })
          .then(res => res.data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args:{
        id: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(parentValue, args){
        return axios.delete(`http://localhost:3000/customers/${args.id}`)
          .then(res => res.data);
      }
    },
    //3. Add editCustomer mutation field
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});