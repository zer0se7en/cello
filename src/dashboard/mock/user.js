import Mock from 'mockjs';
import faker from 'faker';
import paginator from 'cello-paginator';
import organizations from './organization';

const users = Mock.mock({
  'data|11': [
    {
      id() {
        return Mock.Random.guid();
      },
      username: '@name',
      role() {
        return Mock.Random.pick(['administrator', 'user']);
      },
      'organization|1': [
        {
          id() {
            return Mock.Random.guid();
          },
          name() {
            return faker.company.companyName();
          },
        },
      ],
    },
  ],
});

function tokenVerify(req, res) {
  const { token } = req.body;
  switch (token) {
    case 'admin-token':
      return res.json({
        token,
        user: {
          id: 'administrator',
          username: 'admin',
          role: 'operator',
          email: 'admin@cello.com',
          organization: null,
        },
      });
    case 'user-token':
      return res.json({
        token,
        user: {
          id: 'user',
          username: 'user',
          role: 'user',
          email: 'user@cello.com',
          organization: null,
        },
      });
    case 'orgAdmin-token':
      return res.json({
        token,
        user: {
          id: 'org-administrator',
          username: 'orgAdmin',
          role: 'administrator',
          email: 'administrator@cello.com',
          organization: null,
        },
      });
    default:
      return res.json({});
  }
}
export default {
  'POST /api/v1/token-verify': tokenVerify,
  '/api/v1/users': (req, res) => {
    const { page = 1, per_page: perPage = 10 } = req.query;
    const result = paginator(users.data, parseInt(page, 10), parseInt(perPage, 10));
    res.send({
      total: result.total,
      data: result.data,
    });
  },
  'POST /api/v1/auth': (req, res) => {
    const { password, username, type } = req.body;
    if (password === 'pass' && username === 'admin') {
      res.send({
        token: 'admin-token',
        user: {
          id: 'administrator',
          username: 'admin',
          role: 'operator',
          email: 'operator@cello.com',
          organization: null,
        },
      });
      return;
    }
    if (password === 'pass' && username === 'orgAdmin') {
      res.send({
        token: 'orgAdmin-token',
        user: {
          id: 'org-administrator',
          username: 'orgAdmin',
          role: 'administrator',
          email: 'administrator@cello.com',
          organization: null,
        },
      });
      return;
    }
    if (password === 'password' && username === 'user') {
      res.send({
        token: 'user-token',
        user: {
          id: 'user',
          username: 'user',
          role: 'user',
          email: 'user@cello.com',
          organization: null,
        },
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/v1/register': (req, res) => {
    const { username, orgName } = req.body;
    if (!username || username === '') {
      res.send({
        success: false,
        message: 'username is necessary!'
      });
      return;
    }
    if (!orgName || orgName === '') {
      res.send({
        success: false,
        message: 'orgName is necessary!'
      });
      return;
    }
    let success = true;
    let message = '';
    organizations.organizations.data.forEach(function(value){
      if (value.name === orgName) {
        success = false;
        message = 'The org is exist!';
      }
    });
    if (!success) {
      res.send({
        success,
        message
      });
      return;
    }
    organizations.organizations.data.push({
      id: Mock.Random.guid(),
      name: orgName,
      created_at: Date.now()
    });
    res.send({
      success: true,
      message: 'register success!'
    });
  },
  'GET /api/v1/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/v1/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/v1/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/v1/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
