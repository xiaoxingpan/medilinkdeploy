package com.fsd08.MediLink.service;

import com.fsd08.MediLink.entity.Department;
import com.fsd08.MediLink.entity.Message;
import com.fsd08.MediLink.repository.DepartmentRepository;
import com.fsd08.MediLink.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;


    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public Message getMessageById(int id) {
        return messageRepository.findById(id).orElse(null);
    }

    public Message addMessage(Message department) {
//        if (department.getMe_name() == null || department.getDepartment_name().isEmpty()) {
//            throw new IllegalArgumentException("Department name cannot be empty");
//        }
        return messageRepository.save(department);
    }

    public Message updateMessage(Message department) {
//        if (department.getDepartment_name() == null || department.getDepartment_name().isEmpty()) {
//            throw new IllegalArgumentException("Department name cannot be empty");
//        }
        return messageRepository.save(department);
    }

    public void deleteDepartment(int id) {
        messageRepository.deleteById(id);
    }

    public boolean messageExists(int id) {
        return messageRepository.existsById(id);
    }
}
