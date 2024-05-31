# -*- coding: utf-8 -*-
"""
Created By      : ZedFeorius(fuzequan)
Created Time    : 2024/4/29 16:16
File Name       : surf_user.py
Last Edit Time  : 
"""
import traceback

from channels.generic.websocket import AsyncWebsocketConsumer
from surf.modules.util.session_util import Session
from surf.appsGlobal import get_logger

logger = get_logger('user')


class SurfUser(object):
    def __init__(self, user_id: str,  consumer):
        self.__cur_server = None
        self.__user_id = user_id
        self.__servers = []
        self.__ws = AsyncWebsocketConsumer()
        self.update_consumer(consumer)

    def update_consumer(self, consumer):
        self.__ws.scope = consumer.scope
        self.__ws.send = consumer.send

    def check_user_id_by_session_id(self, session_id) -> bool:
        # logger.info(f"sessionId:{session_id}'s user_id is：")
        return Session.get_session_by_id(session_id).get('user_id') == self.__user_id

    def check_user_id(self, user_id):
        return str(user_id) == str(self.__user_id)

    def set_cur_server(self, cur_server):
        self.__cur_server = cur_server

    def check_cur_server(self, cur_server) -> bool:
        return self.__cur_server == cur_server

    async def broadcast(self, text_data):
        try:
            await self.__ws.send(text_data)
            logger.info(f'broadcast data to:{self.__user_id}')
        except Exception as e:
            logger.error(f"broadcast failed, userid:{self.__user_id}, ex:{e}\n{traceback.print_exc()}")