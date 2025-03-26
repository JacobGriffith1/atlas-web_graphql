const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");
const _ = require("lodash");

// Dummy data
const tasks = [
  {
    id: "1",
    title: "Create your first webpage",
    weight: 1,
    description:
      "Create your first HTML file 0-index.html with: -Add the doctype on the first line (without any comment) -After the doctype, open and close an html tag. Open your file in your browser (the page should be blank).",
    projectId: "1"
  },
  {
    id: "2",
    title: "Structure your webpage",
    weight: 1,
    description:
      "Copy the content of 0-index.html into 1-index.html. Create the head and body sections inside the html tag, create the head and body tags (empty) in this order.",
    projectId: "1"
  }
];

// Dummy projects
const projects = [
  {
    id: "1",
    title: "Advanced HTML",
    weight: 1,
    description:
      "Welcome to the Web Stack specialization. The 3 first projects will give you all basics of the Web development: HTML, CSS, and Developer tools. In this project, you will learn how to use HTML tags to structure a web page. No CSS, no styling - don’t worry, the final page will be 'ugly' it’s normal, it’s not the purpose of this project. Important note: details are important! lowercase vs uppercase / wrong letter… be careful!"
  },
  {
    id: "2",
    title: "Bootstrap",
    weight: 1,
    description:
      "Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains CSS and JavaScript design templates for typography, forms, buttons, navigation, and other interface components."
  }
];

// Define TaskType
const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    projectId: { type: GraphQLID },
    project: {
      type: ProjectType,
      resolve(parent, args) {
        return _.find(projects, { id: parent.projectId });
      }
    }
  })
});

// Define ProjectType
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return tasks.filter(task => task.projectId === parent.id); // Find all tasks for project
      }
    }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(tasks, { id: args.id }); // Find and return the task by ID
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(projects, { id: args.id });
      }
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return tasks;
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return projects;
      }
    }
  }
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        // Create a new project to simulate database insertion
        const newProject = {
          id: (projects.length + 1).toString(),
          title: args.title,
          weight: args.weight,
          description: args.description
        };
        projects.push(newProject);
        return newProject;
        // --- When using Mongoose ---
        // const project = newProject({
        //   title: args.title,
        //   weight: args.weight,
        //   description: args.description
        // });
        // return project.save();
      }
    }
    // Additional mutations (like addTask) can be added here
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});