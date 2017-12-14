const schema = {
  '$schema': 'http://json-schema.org/draft-06/schema#',
  'title': 'Intuitree Logfile',
  'type': 'object',
  'properties': {
    'execution': {
      'type': 'object',
      'properties': {
        'version': {
          'type': 'integer',
          'exclusiveMinimum': 0
        },
        'title': {
          'type': 'string'
        },
        'message': {
          'type': 'string'
        }
      },
      'required': [
        'version',
        'title',
        'message'
      ],
      'additionalProperties': false
    },
    'statuses': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string'
          },
          'color': {
            'type': 'string'
          }
        },
        'required': [
          'name',
          'color'
        ],
        'additionalProperties': false
      },
      'minItems': 1,
      'uniqueItems': true
    },
    'tags': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string'
          }
        },
        'required': [
          'name'
        ],
        'additionalProperties': false
      },
      'uniqueItems': true
    },
    'logs': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'parentId': {
            'type': 'integer',
            'minimum': 0
          },
          'id': {
            'type': 'integer',
            'exclusiveMinimum': 0
          },
          'title': {
            'type': 'string'
          },
          'message': {
            'type': 'string'
          },
          'tags': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'tagName': {
                  'type': 'string'
                },
                'value': {
                  'type': 'string'
                }
              },
              'required': [
                'tagName',
                'value'
              ],
              'additionalProperties': false
            }
          },
          'statusName': {
            'type': 'string'
          }
        },
        'required': [
          'parentId',
          'id',
          'title',
          'message',
          'tags',
          'statusName'
        ],
        'additionalProperties': false
      },
      'uniqueItems': true
    },
    'annotations': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'logId': {
            'type': 'integer',
            'exclusiveMinimum': 0
          },
          'changedStatusFromName': {
            'type': 'string'
          },
          'changedStatusToName': {
            'type': 'string'
          },
          'message': {
            'type': 'string'
          },
          'timestamp': {
            'type': 'integer',
            'minimum': 0
          }
        },
        'required': [
          'logId',
          'changedStatusFromName',
          'changedStatusToName',
          'message',
          'timestamp'
        ],
        'additionalProperties': false
      }
    }
  },
  'required': [
    'execution',
    'statuses',
    'tags',
    'logs'
  ],
  'additionalProperties': false
};
export default schema;
