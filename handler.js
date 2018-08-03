'use strict';

require('dotenv').config();
const getUuid = require('uuid/v3');

module.exports.redirect = (event, context, callback) => {
  // return sendResponse({ event, context }, callback);
  try {
    const host = event.headers && event.headers.Host && event.headers.Host.endsWith('.ft.com') 
      ? event.headers.Host 
      : process.env.BLOGS_DEFAULT_HOST;

    const path = [
      event.path,
      event.path.endsWith('/') ? '' : '/'
    ].join('');

    const queryStringParameters = event.queryStringParameters || {};
    const queryString = Object.entries(queryStringParameters)
      .map(p => `${p[0]}=${p[1]}`)
      .join('&');

    const url = [
      'http://',
      host,
      path,
      queryString ? '?' + queryString : ''
    ].join('');

    const uuid = getUuid(url, process.env.UUID_NAMESPACE);
    const location = process.env.FT_BASE_URL + uuid;

    return callback(null, {
      statusCode: 301,
      headers: { 
        "Location": location,
        "X-Legacy-URL": url
      }
    });

  } catch (error) {
    return callback(null, {
      statusCode : error.statusCode || 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message })
    });
  }
}


// module.exports.redirect = (event, context, callback) => {
//   try {
//     const url = getUrl(event);
//     const uuid = getUuid(url, UUID_NAMESPACE);

//     return sendRedirectResponse('https://www.ft.com/content/' + uuid, callback);
//   } catch (error) {
//     return sendErrorResponse(error, callback);
//   }
// }

// module.exports.map = (event, context, callback) => {
//   try {
//     const url = getUrl(event);
//     const uuid = getUuid(url, UUID_NAMESPACE);

//     return sendResponse({ url, uuid }, callback);
//   } catch (error) {
//     return sendErrorResponse(error, callback);
//   }
// }

// const sendRedirectResponse = (location, callback) => {
//   const response = {
//     statusCode: 301,
//     headers: { 
//       "Location": location,
//     }
//   };

//   console.log('RESPONSE:', response);
//   return callback(null, response);  
// }

const sendResponse = (data, callback) => {
  const response = {
    statusCode: 200,
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  };

  console.log('RESPONSE:', response);
  return callback(null, response);
}

// const sendErrorResponse = (error, callback) => {
//   const response = {
//     statusCode : error.statusCode || 500,
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ error: error.message })
//   }

//   console.log("ERROR:", response);
//   return callback(null, response);
// }

// const getUrl = (event) => {
//   if (!event.queryStringParameters || !event.queryStringParameters.url) {
//     throw {statusCode: 400, message: "Bad request: url not specified"};
//   }
//   return decodeURIComponent(event.queryStringParameters.url);
// }





// const mysql = require('mysql');
// const createAsyncQuery = connection => async (sql, values) => new Promise((resolve, reject) => connection.query(sql, values, (e, r, f) => e ? reject(e) : resolve(r)));

// const url = require('url');

// module.exports.mapDb = async (event, context, callback) => {
//   console.log('CREATING MYSQL CONNECTION')
//   const connection = mysql.createConnection(process.env.WP_DB_READ_URL);
  
//   try {
//     console.log("EVENT:", event);

//     if (!event.queryStringParameters || !event.queryStringParameters.url) {
//       throw {statusCode: 400, message: "Bad request: url not specified"};
//     }

//     const blogUrl = url.parse(event.queryStringParameters.url);

//     const asyncQuery = createAsyncQuery(connection);
//     const blogSql = 'SELECT site_id, blog_id FROM wp_blogs WHERE domain=? AND ? REGEXP path ORDER BY LENGTH(path) DESC'
//     console.log('RUNNING QUERY:', blogSql);
//     let results = await asyncQuery(blogSql, [blogUrl.hostname, blogUrl.path]);
//     const blog = results[0];
//     console.log("RESULTS:", blog);
//     if (!blog) throw {statusCode: 404, message: uuid(blogUrl.href, NAMESPACE)};

//     const postSql = `
//       SELECT p.ID 'post_id', m.meta_value 'uuid', p.guid 'url'
//       FROM wp_${blog.blog_id}_posts p 
//       LEFT JOIN wp_${blog.blog_id}_postmeta m 
//       ON m.post_id = p.ID
//       WHERE p.guid = ?
//       AND p.post_type = 'post'
//       AND p.post_status = 'publish'
//       AND m.meta_key = '_blog_post_uid'
//     `;
//     console.log('RUNNING QUERY:', postSql);
//     results = await asyncQuery(postSql, blogUrl.href);
//     const post = results[0];
//     console.log("RESULTS:", post);
//     if (!post) throw {statusCode: 404, message: 'Blogpost not found'};

//     const response = {
//       statusCode: 200,
//       headers: { 
//         "Content-Type": "application/json",
//         "X-Data-Source": "WP-Cache"
//       },
//       body: JSON.stringify({
//         url: post.url,
//         uuid: post.uuid,
//         computed_uuid: uuid(blogUrl.href, NAMESPACE),
//         post_id: post.post_id,
//         blog_id: blog.blog_id,
//         site_id: blog.site_id,
//         debug: {
//           blogUrl,
//           event,
//           context
//         }
//       })
//     };

//     console.log('RESPONSE:', response);
//     // if (connection.threadId) connection.end(e => console.log('MYSQL CONNECTION CLOSED'));
//     return callback(null, response);

//   } catch (e) {
//     const error = {
//       statusCode : e.statusCode || 500,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ error: e.message })
//     }

//     console.log("ERROR:", error);
//     // if (connection.threadId) connection.end(e => console.log('MYSQL CONNECTION CLOSED'));
//     return callback(null, error);

//   } finally {
//     console.log('FINALLY!');
//     if(connection) {
//       console.log('CLOSING MYSQL CONNECTION');
//       connection.end(e => console.log('MYSQL CONNECTION CLOSED'));
//     }
//   }
// };

