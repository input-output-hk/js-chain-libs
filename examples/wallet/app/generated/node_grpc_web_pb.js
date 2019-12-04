/**
 * @fileoverview gRPC-Web generated client stub for iohk.chain.node
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.iohk = {};
proto.iohk.chain = {};
proto.iohk.chain.node = require('./node_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.iohk.chain.node.NodeClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.iohk.chain.node.NodePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.iohk.chain.node.HandshakeRequest,
 *   !proto.iohk.chain.node.HandshakeResponse>}
 */
const methodDescriptor_Node_Handshake = new grpc.web.MethodDescriptor(
  '/iohk.chain.node.Node/Handshake',
  grpc.web.MethodType.UNARY,
  proto.iohk.chain.node.HandshakeRequest,
  proto.iohk.chain.node.HandshakeResponse,
  /**
   * @param {!proto.iohk.chain.node.HandshakeRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.HandshakeResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.iohk.chain.node.HandshakeRequest,
 *   !proto.iohk.chain.node.HandshakeResponse>}
 */
const methodInfo_Node_Handshake = new grpc.web.AbstractClientBase.MethodInfo(
  proto.iohk.chain.node.HandshakeResponse,
  /**
   * @param {!proto.iohk.chain.node.HandshakeRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.HandshakeResponse.deserializeBinary
);


/**
 * @param {!proto.iohk.chain.node.HandshakeRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.iohk.chain.node.HandshakeResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.HandshakeResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodeClient.prototype.handshake =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/iohk.chain.node.Node/Handshake',
      request,
      metadata || {},
      methodDescriptor_Node_Handshake,
      callback);
};


/**
 * @param {!proto.iohk.chain.node.HandshakeRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.iohk.chain.node.HandshakeResponse>}
 *     A native promise that resolves to the response
 */
proto.iohk.chain.node.NodePromiseClient.prototype.handshake =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/iohk.chain.node.Node/Handshake',
      request,
      metadata || {},
      methodDescriptor_Node_Handshake);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.iohk.chain.node.TipRequest,
 *   !proto.iohk.chain.node.TipResponse>}
 */
const methodDescriptor_Node_Tip = new grpc.web.MethodDescriptor(
  '/iohk.chain.node.Node/Tip',
  grpc.web.MethodType.UNARY,
  proto.iohk.chain.node.TipRequest,
  proto.iohk.chain.node.TipResponse,
  /**
   * @param {!proto.iohk.chain.node.TipRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.TipResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.iohk.chain.node.TipRequest,
 *   !proto.iohk.chain.node.TipResponse>}
 */
const methodInfo_Node_Tip = new grpc.web.AbstractClientBase.MethodInfo(
  proto.iohk.chain.node.TipResponse,
  /**
   * @param {!proto.iohk.chain.node.TipRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.TipResponse.deserializeBinary
);


/**
 * @param {!proto.iohk.chain.node.TipRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.iohk.chain.node.TipResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.TipResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodeClient.prototype.tip =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/iohk.chain.node.Node/Tip',
      request,
      metadata || {},
      methodDescriptor_Node_Tip,
      callback);
};


/**
 * @param {!proto.iohk.chain.node.TipRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.iohk.chain.node.TipResponse>}
 *     A native promise that resolves to the response
 */
proto.iohk.chain.node.NodePromiseClient.prototype.tip =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/iohk.chain.node.Node/Tip',
      request,
      metadata || {},
      methodDescriptor_Node_Tip);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.iohk.chain.node.BlockIds,
 *   !proto.iohk.chain.node.Block>}
 */
const methodDescriptor_Node_GetBlocks = new grpc.web.MethodDescriptor(
  '/iohk.chain.node.Node/GetBlocks',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.iohk.chain.node.BlockIds,
  proto.iohk.chain.node.Block,
  /**
   * @param {!proto.iohk.chain.node.BlockIds} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.Block.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.iohk.chain.node.BlockIds,
 *   !proto.iohk.chain.node.Block>}
 */
const methodInfo_Node_GetBlocks = new grpc.web.AbstractClientBase.MethodInfo(
  proto.iohk.chain.node.Block,
  /**
   * @param {!proto.iohk.chain.node.BlockIds} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.Block.deserializeBinary
);


/**
 * @param {!proto.iohk.chain.node.BlockIds} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.Block>}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodeClient.prototype.getBlocks =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/iohk.chain.node.Node/GetBlocks',
      request,
      metadata || {},
      methodDescriptor_Node_GetBlocks);
};


/**
 * @param {!proto.iohk.chain.node.BlockIds} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.Block>}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodePromiseClient.prototype.getBlocks =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/iohk.chain.node.Node/GetBlocks',
      request,
      metadata || {},
      methodDescriptor_Node_GetBlocks);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.iohk.chain.node.BlockIds,
 *   !proto.iohk.chain.node.Header>}
 */
const methodDescriptor_Node_GetHeaders = new grpc.web.MethodDescriptor(
  '/iohk.chain.node.Node/GetHeaders',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.iohk.chain.node.BlockIds,
  proto.iohk.chain.node.Header,
  /**
   * @param {!proto.iohk.chain.node.BlockIds} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.Header.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.iohk.chain.node.BlockIds,
 *   !proto.iohk.chain.node.Header>}
 */
const methodInfo_Node_GetHeaders = new grpc.web.AbstractClientBase.MethodInfo(
  proto.iohk.chain.node.Header,
  /**
   * @param {!proto.iohk.chain.node.BlockIds} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.Header.deserializeBinary
);


/**
 * @param {!proto.iohk.chain.node.BlockIds} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.Header>}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodeClient.prototype.getHeaders =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/iohk.chain.node.Node/GetHeaders',
      request,
      metadata || {},
      methodDescriptor_Node_GetHeaders);
};


/**
 * @param {!proto.iohk.chain.node.BlockIds} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.Header>}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodePromiseClient.prototype.getHeaders =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/iohk.chain.node.Node/GetHeaders',
      request,
      metadata || {},
      methodDescriptor_Node_GetHeaders);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.iohk.chain.node.FragmentIds,
 *   !proto.iohk.chain.node.Fragment>}
 */
const methodDescriptor_Node_GetFragments = new grpc.web.MethodDescriptor(
  '/iohk.chain.node.Node/GetFragments',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.iohk.chain.node.FragmentIds,
  proto.iohk.chain.node.Fragment,
  /**
   * @param {!proto.iohk.chain.node.FragmentIds} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.Fragment.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.iohk.chain.node.FragmentIds,
 *   !proto.iohk.chain.node.Fragment>}
 */
const methodInfo_Node_GetFragments = new grpc.web.AbstractClientBase.MethodInfo(
  proto.iohk.chain.node.Fragment,
  /**
   * @param {!proto.iohk.chain.node.FragmentIds} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.Fragment.deserializeBinary
);


/**
 * @param {!proto.iohk.chain.node.FragmentIds} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.Fragment>}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodeClient.prototype.getFragments =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/iohk.chain.node.Node/GetFragments',
      request,
      metadata || {},
      methodDescriptor_Node_GetFragments);
};


/**
 * @param {!proto.iohk.chain.node.FragmentIds} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.Fragment>}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodePromiseClient.prototype.getFragments =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/iohk.chain.node.Node/GetFragments',
      request,
      metadata || {},
      methodDescriptor_Node_GetFragments);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.iohk.chain.node.PullHeadersRequest,
 *   !proto.iohk.chain.node.Header>}
 */
const methodDescriptor_Node_PullHeaders = new grpc.web.MethodDescriptor(
  '/iohk.chain.node.Node/PullHeaders',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.iohk.chain.node.PullHeadersRequest,
  proto.iohk.chain.node.Header,
  /**
   * @param {!proto.iohk.chain.node.PullHeadersRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.Header.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.iohk.chain.node.PullHeadersRequest,
 *   !proto.iohk.chain.node.Header>}
 */
const methodInfo_Node_PullHeaders = new grpc.web.AbstractClientBase.MethodInfo(
  proto.iohk.chain.node.Header,
  /**
   * @param {!proto.iohk.chain.node.PullHeadersRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.Header.deserializeBinary
);


/**
 * @param {!proto.iohk.chain.node.PullHeadersRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.Header>}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodeClient.prototype.pullHeaders =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/iohk.chain.node.Node/PullHeaders',
      request,
      metadata || {},
      methodDescriptor_Node_PullHeaders);
};


/**
 * @param {!proto.iohk.chain.node.PullHeadersRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.Header>}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodePromiseClient.prototype.pullHeaders =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/iohk.chain.node.Node/PullHeaders',
      request,
      metadata || {},
      methodDescriptor_Node_PullHeaders);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.iohk.chain.node.PullBlocksToTipRequest,
 *   !proto.iohk.chain.node.Block>}
 */
const methodDescriptor_Node_PullBlocksToTip = new grpc.web.MethodDescriptor(
  '/iohk.chain.node.Node/PullBlocksToTip',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.iohk.chain.node.PullBlocksToTipRequest,
  proto.iohk.chain.node.Block,
  /**
   * @param {!proto.iohk.chain.node.PullBlocksToTipRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.Block.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.iohk.chain.node.PullBlocksToTipRequest,
 *   !proto.iohk.chain.node.Block>}
 */
const methodInfo_Node_PullBlocksToTip = new grpc.web.AbstractClientBase.MethodInfo(
  proto.iohk.chain.node.Block,
  /**
   * @param {!proto.iohk.chain.node.PullBlocksToTipRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.iohk.chain.node.Block.deserializeBinary
);


/**
 * @param {!proto.iohk.chain.node.PullBlocksToTipRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.Block>}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodeClient.prototype.pullBlocksToTip =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/iohk.chain.node.Node/PullBlocksToTip',
      request,
      metadata || {},
      methodDescriptor_Node_PullBlocksToTip);
};


/**
 * @param {!proto.iohk.chain.node.PullBlocksToTipRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.iohk.chain.node.Block>}
 *     The XHR Node Readable Stream
 */
proto.iohk.chain.node.NodePromiseClient.prototype.pullBlocksToTip =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/iohk.chain.node.Node/PullBlocksToTip',
      request,
      metadata || {},
      methodDescriptor_Node_PullBlocksToTip);
};


module.exports = proto.iohk.chain.node;

