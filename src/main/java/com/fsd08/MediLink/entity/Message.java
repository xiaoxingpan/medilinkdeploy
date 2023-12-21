package com.fsd08.MediLink.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @Column(name = "id")
    private int id;
    @Column(name = "sender_id")
    private int sender_id;
    @Column(name = "receiver_id")
    private int receiver_id;
    @Column(name = "body")
    private String body;
    @Column(name = "isread")
    private boolean isread;
    @Column(name = "sent_at")
    private LocalDateTime sent_at;

    public Message() {
    }

    public Message(int id, int sender_id, int receiver_id, String body, boolean isread, LocalDateTime sent_at) {
        this.id = id;
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.body = body;
        this.isread = isread;
        this.sent_at = sent_at;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSender_id() {
        return sender_id;
    }

    public void setSender_id(int sender_id) {
        this.sender_id = sender_id;
    }

    public int getReceiver_id() {
        return receiver_id;
    }

    public void setReceiver_id(int receiver_id) {
        this.receiver_id = receiver_id;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public boolean isIsread() {
        return isread;
    }

    public void setIsread(boolean isread) {
        this.isread = isread;
    }

    public LocalDateTime getSent_at() {
        return sent_at;
    }

    public void setSent_at(LocalDateTime sent_at) {
        this.sent_at = sent_at;
    }

}
