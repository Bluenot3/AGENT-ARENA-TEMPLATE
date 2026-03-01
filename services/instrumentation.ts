const eventBuffer: Array<{ eventName: string; payload: Record<string, unknown>; timestamp: string }> = [];

export const trackEvent = (eventName: string, payload: Record<string, unknown> = {}) => {
  const event = {
    eventName,
    payload,
    timestamp: new Date().toISOString()
  };

  eventBuffer.push(event);
  console.info(`[telemetry] ${eventName}`, payload);
};

export const getTrackedEvents = () => eventBuffer;
