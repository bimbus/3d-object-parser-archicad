
export const params = {
  server: 'http://akeneo-pim-api-host',
  clientId: '',
  secret: '',
  username: '',
  password: '',
  storage: 's3',
  s3: {
    credentials: {
      apiVersion: '2006-03-01',
      accessKeyId: '',
      secretAccessKey: '',
      region: 'eu-central-1',
    },
    bucket: 'myBucket',
    prefix: 'catalog/',
  },
}
