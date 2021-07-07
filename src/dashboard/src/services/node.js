import { stringify } from 'qs';
import request from '@/utils/request';

export async function listNode(params) {
  return request(`/api/v1/nodes?${stringify(params)}`);
}

export async function createNode(params) {
  return request('/api/v1/nodes', {
    method: 'POST',
    data: params,
  });
}

export async function getNode(params) {
  return request(`/api/v1/nodes/${stringify(params)}`);
}

export async function listUserForNode(params) {
  return request(`/api/v1/nodes/${stringify(params)}/users`);
}

export async function registerUserToNode(params) {
  return request(`/api/v1/nodes/${params.id}/users`, {
    method: 'POST',
    data: params.message,
  });
}

export async function deleteNode(params) {
  return request(`/api/v1/nodes/${params}`, {
    method: 'DELETE',
  });
}

export async function operateNode(params) {
  return request(`/api/v1/nodes/${params.id}/operations?action=${params.message}`, {
    method: 'POST',
  });
}
