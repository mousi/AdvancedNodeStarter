const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000/blogs');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  afterEach(async () => {
    await page.deleteUser();
  });

  test('can see blog create form', async () => {
    const textTitle = await page.getContentsOf('form .title label');
    const textContent = await page.getContentsOf('form .content label');
    expect(textTitle).toEqual('Blog Title');
    expect(textContent).toEqual('Content');
  });

  describe('And submitting valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });

    test('takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });

    describe('And saving', async () => {
      beforeEach(async () => {
        await page.click('button.green');
        await page.waitFor('.card');
      });

      test('adds blog to index page', async () => {
        const title = await page.getContentsOf('.card-title');
        const content = await page.getContentsOf('p');
        expect(title).toEqual('My Title');
        expect(content).toEqual('My Content');
      });
    });
  });

  describe('And submitting invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');
      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('When not logged in', async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'T',
        content: 'C'
      }
    }
  ];

  test('blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);
    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});
