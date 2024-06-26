# -*- coding: utf-8 -*-
"""
Created By      : ZedFeorius
Created Time    : 2024/4/20 22:37
File Name       : role_model
Project Name    : surf-websocket
Last Edit Time  : 
"""
import traceback
from typing import List, Dict

from typing_extensions import deprecated

from surf.appsGlobal import logger
from surf.modules.util import BaseModel


class RoleModel(BaseModel):
    def __init__(self):
        super().__init__()

    @deprecated("Old templet function")
    def get_all_permissions(self):
        result = []
        try:
            sql = """SELECT c_permission_id as id FROM public.t_permissions"""
            result = self._pg.query(sql)
        except Exception as e:
            logger.error(f"获取所有权限失败：{e}\n{traceback.format_exc()}")
        return result

    def create_role(self, filters):
        return self._pg.save("t_roles", filters, return_id=True, return_id_clumn="c_role_id")

    def get_server_role_by_name(self, filters):
        result = []
        try:
            sql = """SELECT c_role_id as id FROM public.t_roles WHERE c_server_id = %s AND c_name = %s"""
            result = self._pg.query(sql, [filters['server_id'], filters['name']])
        except Exception as e:
            logger.error(f"failed to get server's role by id:{e}\n{traceback.format_exc()}")
        finally:
            return result

    def get_roles_by_user(self, user_id) -> List[str]:
        result = []
        try:
            sql = """
            SELECT c_role_id as id FROM t_user_roles WHERE c_user_id = %s
            """
            res = self._pg.query(sql, [user_id])
            for r in res:
                result.append(r['id'])
        except Exception as e:
            logger.error(f"get_roles_by_user:{e}\n{traceback.format_exc()}")
        finally:
            return result

    def get_permissions_by_role(self, role_id) -> List[Dict[str, str]]:
        result = []
        try:
            sql = """
            SELECT c_permissions as permissions, c_level as level FROM public.t_roles WHERE c_role_id = %s
            """
            result.append(self._pg.query(sql, [role_id]))
        except Exception as e:
            logger.error(f"get_permissions_by_role:{e}\n{traceback.format_exc()}")
        finally:
            return result
