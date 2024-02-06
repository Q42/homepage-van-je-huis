const componentConfig = {
  description: 'Create a reusable component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is your component name?',
    },
    {
      type: 'input',
      name: 'category',
      message:
        'What is the category of your component? (for example: Shared, Layout, Form, etc.)',
    },
    {
      type: 'confirm',
      name: 'hasFolder',
      message: 'Does your component reside in a subfolder?',
    },
    {
      type: 'input',
      name: 'folder',
      message: "What is your component's subfolder name?",
      when: (answers) => !!answers.hasFolder,
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'components{{#if folder}}/{{folder}}{{/if}}/{{pascalCase name}}/index.vue',
      templateFile: 'templates/component/Component.vue.hbs',
    },
    {
      type: 'add',
      path: 'components{{#if folder}}/{{folder}}{{/if}}/{{pascalCase name}}/{{pascalCase name}}.stories.ts',
      templateFile: 'templates/component/Component.stories.ts.hbs',
    },
  ],
}

export default (plop) => {
  plop.setGenerator('component', componentConfig)
}
