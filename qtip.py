#!/usr/bin/env python
"""
*2013.09.06 15:47:21
Q-TIP

Q-method Testing and Inquiry Platform

launch by running:
python application.py

"""
import os, random, string, codecs, json
from datetime import datetime

from bottle import static_file
from bottle import get, post, request, redirect
from bottle import HTTPResponse
from bottle import route, run
from bottle import template

import bottle

from helpers import load_json, save_json

server_root = os.path.dirname(os.path.realpath(__file__))
#default is "./views/" directory
template_path = os.path.join(server_root, 'templates')
bottle.TEMPLATE_PATH.append(template_path)

data_path = os.path.join(server_root, 'data')
if not os.path.exists(data_path):
    os.makedirs(data_path)

#Be careful when specifying a relative root-path such as root='./static/files'.
#The working directory (./) and the project directory are not always the same.
  
#to serve files in subdirectories, loosen the wildcard as follows
#@route('/static/:path#.+#')
#def server_static(path):
#    return static_file(path, root='/path/to/your/static/files')

@route('/robots.txt')
def robots_static():
    path = os.path.join(server_root)
    return static_file("robots.txt", root=path)
  
@route('/humans.txt')
def humans_static():
    path = os.path.join(server_root)
    return static_file("humans.txt", root=path)
  
@route('/apple-touch-icon:suffix#.+#')
def apple_touch_static(suffix):
    path = os.path.join(server_root)
    filename = "apple-touch-icon%s" % suffix
    return static_file(filename, root=path)


@route('/css/:filename#.+#')
def css_static(filename):
    css_path = os.path.join(server_root, 'css')
    #return static_file(filename, root='./css')
    return static_file(filename, root=css_path)

@route('/js/:filename#.+#')
def js_static(filename):
    js_path = os.path.join(server_root, 'js')
    return static_file(filename, root=js_path)

@route('/img/:filename#.+#')
def images_static(filename):
    image_path = os.path.join(server_root, 'img')
    return static_file(filename, root=image_path)

@route('/favicon.ico')
@route('/favicon.png')
def favicon_static():
    image_path = os.path.join(server_root, 'img')
    return static_file('favicon.png', root=image_path)
    
#to force a download, use the following:
#    return static_file(filename, root='/path/to/static/files', download=filename)


def generate_id(size=8, chars=string.ascii_lowercase + string.digits):
    """
    http://stackoverflow.com/questions/2257441/python-random-string-generation-with-upper-case-letters-and-digits
    """
    return ''.join(random.choice(chars) for x in range(size))

def load_subject(mkey, skey):
    """
    this needs to be done for most subject calls...
    abstracting here
    """
    method_path = os.path.join(data_path, mkey)
    if not os.path.exists(method_path):
        return template('404', key=mkey, item="method")
    else:
        subject_path = os.path.join(method_path, skey)
        if not os.path.exists(subject_path):
            return template('404', key=skey, item="subject")        
        else:
            
            method_config = os.path.join(method_path, "config.json")
            #result = load_json(config)
            method_json_file = codecs.open(method_config, 'r', encoding='utf-8', errors='ignore')
            method_json = method_json_file.read()
            method_details = json.loads(method_json)

            subject_config = os.path.join(subject_path, "subject_config.json")
            subject_json_file = codecs.open(subject_config, 'r', encoding='utf-8', errors='ignore')
            subject_json = subject_json_file.read()
            subject_details = json.loads(subject_json)

            return [method_json, method_details, subject_json, subject_details]

@route('/layout/:mkey/:skey/')
def subject_layout(mkey, skey):
    """
    show how items were arranged on the grid
    return a csv for download
    """
    [method_json, method_details, subject_json, subject_details] = load_subject(mkey, skey)
    #print subject_details
    tree = json.loads(subject_details['json'])
    #print tree
    #tree = json.loads(subject_details['json'])
    main = tree['children']
    placed = {}
    for item in main:
        if item['name'] == 'placed':
            placed = item

    #print placed

    csv = ''
    columns = placed['children']
    for column in columns:
        #print column['name']
        for item in column['children']:
            #print "%s,%s,%s" % (column['name'], item['name'], item['content'])
            csv += '%s,%s,"%s"\n' % (column['name'], item['name'], item['content'])
    
    headers = {}
    
    #mimetype, encoding = mimetypes.guess_type(filename)
    headers['Content-Type'] = 'text/csv'

    download = "%s-layout.csv" % skey
    headers['Content-Disposition'] = 'attachment; filename="%s"' % download

    body = '' if request.method == 'HEAD' else csv

    return HTTPResponse(body, **headers)

@route('/comments/:mkey/:skey/')
def subject_comments(mkey, skey):
    """
    generate a csv for the responses given by the subject
    return a csv for download
    """
    [method_json, method_details, subject_json, subject_details] = load_subject(mkey, skey)
    #print subject_details
    tree = json.loads(subject_details['json'])
    #print tree
    main = tree['children']
    responses = {}
    neutral = {}
    for item in main:
        #print item['name']
        if item['name'] == 'responses':
            responses = item
        elif item['name'] == 'neutral':
            neutral = item

    #print placed

    csv = ''

    for response in responses['children']:
        #print '%s,"%s"\n' % (response['name'], response['content'])
        csv += '%s,"%s"\n' % (response['name'], response['content'])
        
    csv += 'neutral_col,"%s"\n' % (neutral['content'])
    headers = {}
    
    #mimetype, encoding = mimetypes.guess_type(filename)
    headers['Content-Type'] = 'text/csv'

    download = "%s-comments.csv" % skey
    headers['Content-Disposition'] = 'attachment; filename="%s"' % download

    body = '' if request.method == 'HEAD' else csv

    return HTTPResponse(body, **headers)



@route('/history/:mkey/:skey/')
def subject_history(mkey, skey):
    """
    show how items were arranged on the grid
    return a csv for download
    """
    [method_json, method_details, subject_json, subject_details] = load_subject(mkey, skey)

    csv = subject_details['history']

    headers = {}
    
    #mimetype, encoding = mimetypes.guess_type(filename)
    headers['Content-Type'] = 'text/csv'

    download = "%s-history.csv" % skey
    headers['Content-Disposition'] = 'attachment; filename="%s"' % download

    body = '' if request.method == 'HEAD' else csv

    return HTTPResponse(body, **headers)



@route('/details/:mkey/:skey/')
def subject_details(mkey, skey):
    """
    show details for the specified subject
    """
    [method_json, method_details, subject_json, subject_details] = load_subject(mkey, skey)
    #tree = json.loads(subject_details['json'])
    history = subject_details['history']
    lines = history.splitlines()
    html = ''
    for line in lines:
        html += line + "<br>"


    #return template('details', mkey=mkey, skey=skey, method_details=method_details, method_json=method_json, subject_details=subject_details, subject_json=subject_json, width=col_width, padding=padding)
    return template('details', skey=skey, method_details=method_details, subject_details=subject_details, html=html)


@post('/subject/:mkey/:skey/json')
@post('/s/:mkey/:skey/json')
def post_subject_json(mkey=None, skey=None):
    method_path = os.path.join(data_path, mkey)
    if not os.path.exists(method_path):
        return template('404', key=mkey, item="method")
    else:
        subject_path = os.path.join(method_path, skey)
        if not os.path.exists(subject_path):
            return template('404', key=skey, item="subject")        
        else:
            
            method_config = os.path.join(method_path, "config.json")
            #result = load_json(config)
            method_json_file = codecs.open(method_config, 'r', encoding='utf-8', errors='ignore')
            method_json = method_json_file.read()
            method_details = json.loads(method_json)

            subject_config = os.path.join(subject_path, "subject_config.json")
            subject_json_file = codecs.open(subject_config, 'r', encoding='utf-8', errors='ignore')
            subject_json = subject_json_file.read()
            subject_details = json.loads(subject_json)
            #subject_data = load_json(subject_config)

            #changed = False
            now = datetime.now()

            if not subject_details['columns']:
                subject_details['columns'] = method_details['columns']
                #changed = True
                
            #if request.forms.get('json') != subject_details['json']:
            #this includes the whole tree from javascript:
            #  available, placed, and soon responses
            subject_details['json'] = request.forms.get('json')
                #changed = True

            if not subject_details['started']:
                subject_details['started'] = now.strftime("%Y.%m.%d %H:%M:%S")

            subject_details['last_update'] = now.strftime("%Y.%m.%d %H:%M:%S")

            #subject_details['history'] += u"%s,%s\n" % (now.strftime("%Y.%m.%d %H:%M:%S"), request.forms.get('action'))
            #subject_details['history'] += unicode(now.strftime("%Y.%m.%d %H:%M:%S")) + u"," + unicode(request.forms.get('action'))
            #this avoids:
            # UnicodeDecodeError: 'ascii' codec can't decode byte 0xe2 in position 99: ordinal not in range(128)

            subject_details['history'] += unicode(now.strftime("%Y.%m.%d %H:%M:%S")) + u"," + request.forms.get('action').decode("utf-8") + u"\n"
                
            save_json(subject_config, subject_details)

            return template('success')
    

@route('/subject/:mkey/:skey/thank_you')
#@route('/subject/:mkey/:skey/thank_you/')
@route('/s/:mkey/:skey/thank_you')
#@route('/s/:mkey/:skey/thank_you/')
def thank_you(mkey, skey):
    """
    Display a simple message thanking the person for participating
    """
    
    return template('thank_you', mkey=mkey, skey=skey)

@route('/subject/:mkey/:skey/')
#@route('/subject/:mkey/:skey')
@route('/s/:mkey/:skey/')
#@route('/s/:mkey/:skey')
def subject(mkey, skey):
    """
    main sort interface for the specified subject
    """
    method_path = os.path.join(data_path, mkey)
    if not os.path.exists(method_path):
        return template('404', key=mkey, item="method")
    else:
        subject_path = os.path.join(method_path, skey)
        if not os.path.exists(subject_path):
            return template('404', key=skey, item="subject")        
        else:
            
            method_config = os.path.join(method_path, "config.json")
            #result = load_json(config)
            method_json_file = codecs.open(method_config, 'r', encoding='utf-8', errors='ignore')
            method_json = method_json_file.read()
            method_details = json.loads(method_json)

            subject_config = os.path.join(subject_path, "subject_config.json")
            subject_json_file = codecs.open(subject_config, 'r', encoding='utf-8', errors='ignore')
            subject_json = subject_json_file.read()
            subject_details = json.loads(subject_json)

            #some overlap here with what is in subject.js
            #but it will probably be easier, since we need it both places
            #and it depends on the state of the subject (started vs new)
            
            if subject_details.has_key('columns') and subject_details['columns']:
                columns = subject_details['columns'].split(' ')
            else:
                columns = method_details['columns'].split(' ')

            #print columns
            #print len(columns)
            #in percent width:
            padding = .5
            padding_total = (len(columns)) * padding
            col_width = (100.0 - padding_total) / ( len(columns) )

            #Adding a special check here
            #for a sample method / sample participant
            #in that case we don't want to track any of the old sessions
            #erase them here:

            #if (mkey == 'izrdrpjo') and (skey == 'tlgxbp0n'):
            if (mkey == '9cngrc20') and (skey == 'lij1w5nd'):
                subject_details['columns'] = u""
                subject_details['json'] = u""
                #a textual representation of where each statement is
                subject_details['state'] = u""
                subject_details['history'] = u""
                #is it finished? complete? this will prevent further changes:
                subject_details['locked'] = False

                # after first movement
                subject_details['started'] = u""
                subject_details['last_update'] = u""

                subject_json = json.dumps(subject_details)

            return template('subject', mkey=mkey, skey=skey, method_details=method_details, method_json=method_json, subject_details=subject_details, subject_json=subject_json, width=col_width, padding=padding)

    
@route('/method/:key/new')
def subject_new(key):
    """
    create a new subject for the Q-Method specified by key
    """
    method_path = os.path.join(data_path, key)
    if not os.path.exists(method_path):
        return template('404', key=key, item="method")
    else:
        #look for existing subjects:
        options = os.listdir(method_path)
        new_option = ""
        #make sure that:
        #a) we have a new id and
        #b) the new id has not already been used
        while (not new_option) or (new_option in options):
            new_option = generate_id()

        #make new directory in method_path
        subject_path = os.path.join(method_path, new_option)
        if not os.path.exists(subject_path):
            os.makedirs(subject_path)
        else:
            #This should not ever happen with above check, but just in case...
            raise ValueError, "Subject path exists, but it shouldn't: %s" % subject_path

        #make an empty configuration file
        config = os.path.join(subject_path, "subject_config.json")
        result = load_json(config, create=True)
        #once the subject starts sorting, we will cache this locally
        #based on the current state of the method configuration
        #result['statements'] = ""
        result['columns'] = u""
        result['json'] = u""
        result['started'] = u""
        #a textual representation of where each statement is
        result['state'] = u""
        result['history'] = u""
        #is it finished? complete? this will prevent further changes:
        result['locked'] = False
        #now:
        now = datetime.now()
        result['created'] = now.strftime("%Y.%m.%d %H:%M:%S")

        # after first movement
        result['started'] = u""
        result['last_update'] = u""

        save_json(config, result)

        #redirect to the new method's page:        
        redirect("/method/" + key + "/")


@route('/method/:key/json')
def get_method_json(key=None):
    method_path = os.path.join(data_path, key)
    if not os.path.exists(method_path):
        return template('404', key=key, item="method")
    else:
        config = os.path.join(method_path, "config.json")
        json_file = codecs.open(config, 'r', encoding='utf-8', errors='ignore')
        return json_file.read()
    
#@route('/method/:key/json', method='POST')
#equivalent to:
@post('/method/:key/json')
def post_method_json(key=None):
    #print dir(request.forms)
    #print request.forms.keys()
    
    method_path = os.path.join(data_path, key)
    if not os.path.exists(method_path):
        return template('404', key=key, item="method")
    else:
        config = os.path.join(method_path, "config.json")
        result = load_json(config)

        changed = False
        for key in request.forms.keys():
            #special case for 'statements' key...
            #want to get rid of any extra newline characters
            #this will help calculate the number of statements more accurately
            #(rather than stripping newlines everywhere we look at statements)
            #
            #this works here, but it will make it difficult to provide
            #feedback to the user about how many statements there are
            #compared to how many spaces there are available in columns
            #adding a similar check in method.js
            if key == "statements":
                text = request.forms.get(key)
                lines = text.splitlines()
                new_lines = []
                for line in lines:
                    if line:
                        new_lines.append(line)
                value = '\n'.join(new_lines)
            else:
                value = request.forms.get(key)
            
            if value != result[key]:
                #print "%s (original) != %s (new)" % (result[key], request.forms.get(key))

                result[key] = value
                changed = True

        if changed:
            #print "METHOD CONFIG CHANGED!!!! (saving)"
            save_json(config, result)
            
        return template('success')
    

@route('/method')
@route('/method/')
@route('/method/:key')
@route('/method/:key/')
def method(key=None):
    """
    show details + configuration for the specified method
    """
    method_path = os.path.join(data_path, key)
    if not os.path.exists(method_path):
        return template('404', key=key, item="method")
    else:
        config = os.path.join(method_path, "config.json")
        #result = load_json(config)
        json_file = codecs.open(config, 'r', encoding='utf-8', errors='ignore')
        dj = json_file.read()
        result = json.loads(dj)
        
        subjects = os.listdir(method_path)
        subjects.remove("config.json")

        #oldest first
        subjects.sort(key=lambda s: os.path.getctime(os.path.join(method_path, s)))

        return template('method', key=key, details=result, details_json=dj, subjects=subjects)

@route('/method/:key/bookmark/')
@route('/method/:key/bookmark')
def method(key=None):
    """
    show a note prompting the user to bookmark the new method
    """
    method_path = os.path.join(data_path, key)
    if not os.path.exists(method_path):
        return template('404', key=key, item="method")
    else:
        return template('bookmark', key=key)
        
    
    
@route('/configure')
def configure():
    #look for existing methods:
    options = os.listdir(data_path)
    results = {}
    for option in options:
        method_path = os.path.join(data_path, option)
        config = os.path.join(method_path, "config.json")
        if os.path.exists(config):
            result = load_json(config)
            results[option] = result
        
    return template('configure', options=results)


@route('/configure/new')
def method_new(name="Untitled Q-Method", owner="Your Name", email="email", phone='phone', notes=''):
    #look for existing methods:
    options = os.listdir(data_path)
    new_option = ""
    #make sure that:
    #a) we have a new id and
    #b) the new id has not already been used
    while (not new_option) or (new_option in options):
        new_option = generate_id()

    #make new directory in method_path
    method_path = os.path.join(data_path, new_option)
    if not os.path.exists(method_path):
        os.makedirs(method_path)
    else:
        #This should never happen with above while loop, but just in case...
        raise ValueError, "Path exists, but it shouldn't: %s" % method_path
    
    #make an empty configuration file
    config = os.path.join(method_path, "config.json")
    result = load_json(config, create=True)
    result['name'] = name
    result['owner'] = owner
    result['email'] = email
    result['phone'] = phone
    result['notes'] = notes
    result['statements'] = """1. First sample statement
2. Second sample statement"""
    result['columns'] = '2 3 5 6 8 6 5 3 2'

    save_json(config, result)
    
    #redirect to the new method's page:        
    redirect("/method/" + new_option + "/bookmark/")



@post('/create')
def make_method(key=None):
    fields = [ ['name', 'Method title:', ''], ['owner', 'Your name:', ''], ['email', 'Your email:', ''], ['phone', 'Your phone:', ''], ['notes', 'Additional notes:', ''] ]
    
    fields = []

    valid = True

    name = request.forms.get('name')
    if not name:
        fields.append(['name', 'Method title:', '', "The title of your Q-Method"])
        valid = False
    else:
        fields.append(['name', 'Method title:', name])

    owner = request.forms.get('owner')
    if not owner:
        fields.append(['owner', 'Your name:', '', "First and Last"])
        valid = False
    else:
        fields.append(['owner', 'Your name:', owner])

    email = request.forms.get('email')
    if not email:
        fields.append(['email', 'Your email:', '', "Valid email address"])
        valid = False
    else:
        fields.append(['email', 'Your email:', email])

    phone = request.forms.get('phone')
    if not phone:
        fields.append(['phone', 'Your phone:', '', "Valid phone number"])
        valid = False
    else:
        fields.append(['phone', 'Your phone:', phone])

    notes = request.forms.get('notes')
    fields.append(['notes', 'Additional notes:', notes])
        
    if not valid:
        return template('create', fields=fields)
    else:
        #create the new method here
        method_new(name, owner, email, phone, notes)


@route('/create')
def make_method(key=None):
    #fields = [ ['name', 'Method name:', 'Title', ''], ['owner', 'Your name:', '', ''], ['email', 'Your email:', '', ''], ['phone', 'Your phone:', '', ''], ['notes', 'Additional notes:', '', ''] ]
    fields = [ ['name', 'Method title:', ''], ['owner', 'Your name:', ''], ['email', 'Your email:', ''], ['phone', 'Your phone:', ''], ['notes', 'Additional notes:', ''] ]
    return template('create', fields=fields)


@route('/help')
def faq():
    return template('help', body='')


@route('/')
@route('/:name')
def index(name='World'):
    return template('home', body='Stuff and Things')
