/* eslint-disable max-len */
import { registerAs } from '@nestjs/config';
import { configAppSetting } from './consts';

export default registerAs(configAppSetting, () => ({
  gracePeriod: parseInt(process.env.GRACE_PERIOD || (60 * 10).toString(), 10), // 600s
  firebase: {
    type: 'service_account',
    project_id: 'seim-gulagi',
    private_key_id: '368936242cbf0d78b5e2f592e93740bc12716094',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCLUsuy12e5UNcr\nCMJJk4jrJTgBbVeljf1EBr0UZ1YVsPx7kw8Nnk1iJ6ChXEPRGHRZRAmfPPmwSxh6\ng0Pw83FvUe0hJPCeT1f0qS7Z23ls1dpWdRTOs/GSR4KX75AUGKwcd5JEHuiJG2q5\nIZ6xdsZyV1rjz6o4YMx7g8445wbV/5KLc1cFOXi6FPl2Z2zhGWmMDSb9fKUdUPFu\ndMwO5Agjms/e3a1I93KJ46sYKc1obkXP8sCrX93ppZDh64rKU5ZRHJF2CTj0S2vZ\n7vTzSz1wLtIRdJtPtIPzP9nO6Dn3lXtSq2gJ/nrvJw22x3ndov7CKpOyYhRB+0v6\nmXZeJlgfAgMBAAECggEAFvXMbKsDr047l3OjE8haM75Mziy8g/kJYvDlWiZ0Jlum\nJaCk8MPvfByMY+s2SzrczxU1AhFkvgEyMIZ6EjcHBlHEYsZEAng68NlXcj8Gx2va\nxo1sTMA/hbF+kRbBchO60W+BzZ4hCO9ZatcNNbEdn8b2Sz10OkRMOT1jJTeAMJCR\nIo3LTdgJn0KMxdpJ1j/I+MUmjqrcHBfmorKSLJir3ME0GkWKuw3+ptUt2LHI1Ery\ne9trOnUAU4/MANzF+yZaKy6kJnu8GctL4QG1NQB6jD8kzJgG1xHGdI23HNRhd57H\ndufMnIifMpJP6hPtM3PFFWJ/r1M/PiHVAw16pMjO+QKBgQC4wurQWLpf6P3ZWBq3\n4TwyO3nn9EOhlLvZ40qAjnHTtj7lwrOP3PvKvGCIzBJwZPsaQZ30iZyzLAeB8fAc\nJab3prE+xI+INcaP1so3quDOizTAFhJrc5JZ0toYvkNxjrgcYJ2SJbkRPgjPAkLL\nhhAaPXSEPoYfl9Xw3a95JmKuNQKBgQDBCt8n6PZqIG+XkmEpgrKb022xZjcjfoAf\nCxPNyP0f/DEMDqV9JNte/85Z4joLTrhTLRqcysZhQIiuQNCIlYMl2M10DmLFhu8a\nmMQ3P9vIl86pPqgdwaaKhtJmk+4/Q6MnhQepFc4JBszabKeWwa1I+dBSVKrussOe\nA2vzqszHgwKBgQCmjtCv0czx+VAeRtaPPXTOs99Jw2HUoAhYfBYFnmPuvzQkXEkT\nP9udAATmTVGyENZs7QpAEG46904tTrVuKmNCjfrq4rehyxidQrw5Qso2aDe9kig4\nxY8BepsyAxM5o7dFnbNutKMJcCrwstEUOF77yLrpHJQ8ltw+rxoo1PnQoQKBgQCJ\nv6U/iFgVoLGged6FTXMACJ3UobikxkbMYA4woMQnB8FD9kuWgi9bmbP4pZp/qRuU\nlrHPwk5O5Uri9PMZE38zCYKJ1x4aD1AdLXeOaS3+9HyOflxeZ2ncnZoTgmnWkQAi\nWiX+PMX54PVaw3/O7sMlOMWziiEzFTLLVWu5w14+2wKBgQCK+Z9Km2aRkr4KJMmB\nohQd4ukgiuM6gQ/93bHqqHI0TQy4XHq8wHqm1cCtI5a7jmprhOveISgUBMskBAnr\nsmDIrfF02cWaoJ2QGYNAQ4WluIoZ9I6xK6Nz/MAkaXLE0gc1t86OJvKnS9/EGItX\nNKxsP71ErHnct1iGfQiLnKXcfQ==\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-t4k0e@seim-gulagi.iam.gserviceaccount.com',
    client_id: '110435190081207680911',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-t4k0e%40seim-gulagi.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  },
  storageBucket: 'jackpot-cf8ad.appspot.com',
  jwtSecret: process.env.JWT_SECRET,
}));
