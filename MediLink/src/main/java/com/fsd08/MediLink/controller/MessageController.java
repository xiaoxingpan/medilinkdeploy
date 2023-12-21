package com.fsd08.MediLink.controller;

import com.fsd08.MediLink.entity.Department;
import com.fsd08.MediLink.entity.Message;
import com.fsd08.MediLink.repository.MessageRepository;
import com.fsd08.MediLink.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.DELETE, RequestMethod.GET, RequestMethod.PUT, RequestMethod.POST})
@RequiredArgsConstructor
public class MessageController {
    private static final Logger logger = LoggerFactory.getLogger(DepartmentController.class);
    private final MessageRepository messageRepository;
    private final MessageService messageService;

//    public MessageController(MessageRepository messageRepository, MessageService messageService) {
//        this.messageRepository = messageRepository;
//        this.messageService = messageService;
//    }

    @GetMapping("/messages")
    public List<Message> getAllMessages() {
        List<Message> messages = messageRepository.findAll();
        logger.info("Retrieved {} messages from the database.", messages.size());
        return messages;
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> createMessage(@RequestBody Message message) throws URISyntaxException {
        Message result =messageRepository.save(message);
        return ResponseEntity.created(new URI("/api/departments/" + result.getId())).body(result);
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<?> getOneMesssage(@PathVariable int id) {
        Optional<Message> message = messageRepository.findById(id);
        return message.map(response -> ResponseEntity.ok().body(response)).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/messages/{id}")
    public ResponseEntity<Message> updateMessage(@PathVariable int id, @RequestBody Message message) {
        if (!messageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        message.setId(id);
        Message result = messageRepository.save(message);
        return ResponseEntity.ok().body(result);
    }


    @DeleteMapping("/messages/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable int id) {
        messageRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
