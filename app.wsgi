import os, sys
# Change working directory so relative paths (and template lookup) work again
_module_dir = os.path.dirname(os.path.realpath(__file__))
os.chdir(_module_dir)
sys.path.insert(0, _module_dir)

print os.getcwd()

import monitor
monitor.start(interval=1.0)
monitor.track(os.path.join(os.path.dirname(__file__), 'qtip.py'))
monitor.track(os.path.join(os.path.dirname(__file__), 'templates', 'method.tpl'))
monitor.track(os.path.join(os.path.dirname(__file__), 'templates', 'subject.tpl'))

import bottle
from qtip import *

#bottle.debug(True)

application = bottle.default_app()
