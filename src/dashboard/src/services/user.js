/*
 SPDX-License-Identifier: Apache-2.0
*/
import request from '@/utils/request';

export async function query() {
  return request('/api/v1/users');
}

export async function queryCurrent() {
  const token = localStorage.getItem('cello-token');
  return request('/api/v1/token-verify', {
    method: 'POST',
    data: {
      token,
    },
  });
}

export async function createUser(params) {
  return request('/api/v1/users', {
    method: 'POST',
    data: params,
  });
}

export async function deleteUser(id) {
  return request(`/api/v1/users/${id}`, {
    method: 'DELETE',
  });
}
