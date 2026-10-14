package rw.rra.taxpayerservice.domain;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class ServiceRequestEventStream {

	private static final Logger logger = LoggerFactory.getLogger(ServiceRequestEventStream.class);

	private final CopyOnWriteArrayList<SseEmitter> clients = new CopyOnWriteArrayList<>();

	public SseEmitter subscribe() {
		SseEmitter emitter = new SseEmitter(0L);
		clients.add(emitter);
		emitter.onCompletion(() -> clients.remove(emitter));
		emitter.onTimeout(() -> clients.remove(emitter));
		emitter.onError(error -> clients.remove(emitter));
		return emitter;
	}

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void publish(ServiceRequestChangedEvent event) {
		for (SseEmitter client : clients) {
			try {
				client.send(SseEmitter.event()
						.name("service-request-updated")
						.data(event.requestId()));
			} catch (IOException | IllegalStateException exception) {
				clients.remove(client);
				client.completeWithError(exception);
				logger.warn("Removed a disconnected front-desk update stream", exception);
			}
		}
	}
}
