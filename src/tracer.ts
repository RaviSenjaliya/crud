import tracer from "dd-trace";

// Initialize Datadog tracing always
tracer.init({
  appsec: true, // security monitoring
  logInjection: true, // attach trace ids to logs
});

export default tracer;
