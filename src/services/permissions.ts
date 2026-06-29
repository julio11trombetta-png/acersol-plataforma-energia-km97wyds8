import pb from '@/lib/pocketbase/client'

export const getPermissionGroups = () =>
  pb.collection('permission_groups').getFullList({ sort: 'name' })

export const createPermissionGroup = (data: {
  name: string
  description?: string
  permissions: string[]
}) =>
  pb
    .collection('permission_groups')
    .create({ ...data, permissions: JSON.stringify(data.permissions) })

export const updatePermissionGroup = (
  id: string,
  data: Partial<{ name: string; description: string; permissions: string }>,
) => pb.collection('permission_groups').update(id, data)

export const deletePermissionGroup = (id: string) => pb.collection('permission_groups').delete(id)

export const getUserPermissions = (userId: string) =>
  pb.collection('user_permissions').getFirstListItem(`userId = "${userId}"`)

export const getAllUserPermissions = () =>
  pb.collection('user_permissions').getFullList({ expand: 'userId,groupIds' })

export const setUserPermissions = (userId: string, permissions: string[], groupIds: string[]) =>
  pb.collection('user_permissions').create({
    userId,
    permissions: JSON.stringify(permissions),
    groupIds,
  })

export const updateUserPermissions = (id: string, permissions: string[], groupIds: string[]) =>
  pb.collection('user_permissions').update(id, {
    permissions: JSON.stringify(permissions),
    groupIds,
  })

export const resolveUserPermissions = async (userId: string): Promise<string[]> => {
  try {
    const record = await getUserPermissions(userId)
    let perms: string[] = []
    try {
      perms = JSON.parse(record.permissions || '[]')
    } catch {
      perms = []
    }
    if (record.expand?.groupIds) {
      for (const g of record.expand.groupIds) {
        try {
          const gp = JSON.parse(g.permissions || '[]')
          perms = [...perms, ...gp]
        } catch {
          /* */
        }
      }
    }
    return [...new Set(perms)]
  } catch {
    return []
  }
}
