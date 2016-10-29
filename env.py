from configparser import ConfigParser
from os import path
import MySQLdb


class Env(object):
    config = ConfigParser()
    read = False

    @staticmethod
    def get(name):
        if not Env.read:
            Env.config.read_file(open(path.dirname(path.abspath(__file__)) + '/.env'))
            Env.read = True
        return Env.config.get('SETTINGS', name)


class DB(object):
    __db = None

    @staticmethod
    def get():
        if DB.__db is None:
            DB.__db = MySQLdb.connect(
                Env.get('MYSQL_DATABASE_HOST'),
                Env.get('MYSQL_DATABASE_USER'),
                Env.get('MYSQL_DATABASE_PASSWORD'),
                Env.get('MYSQL_DATABASE_DB')
            )
        return DB.__db
