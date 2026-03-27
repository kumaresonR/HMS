//package com.hms.services.ambulancemanagement.service;
//
//import jakarta.annotation.PostConstruct;
//import org.springframework.stereotype.Service;
//
//import java.io.InputStream;
//import java.io.OutputStream;
//import java.net.Socket;
//import java.nio.ByteBuffer;
//import java.nio.ByteOrder;
//import java.util.Arrays;
//
//@Service
//public class EsslDeviceClientService {
//
//    private static final int DEVICE_PORT = 4370;
//    private Socket socket;
//    private InputStream inputStream;
//    private OutputStream outputStream;
//    private boolean running = true;
//
//    @PostConstruct
//    public void startConnection() {
//        new Thread(this::connectToDevice).start();
//    }
//
//    private void connectToDevice() {
//        String deviceIp = "192.168.29.201"; // your device IP
//        try {
//            socket = new Socket(deviceIp, DEVICE_PORT);
//            inputStream = socket.getInputStream();
//            outputStream = socket.getOutputStream();
//            System.out.println("Connected to device: " + deviceIp);
//
//            // Send connect command
//            byte[] connectCommand = buildConnectCommand();
//            outputStream.write(connectCommand);
//
//            // Continuously listen for device events
//            while (running) {
//                byte[] response = new byte[1024];
////                if (inputStream.available() > 0) {
//                    int bytesRead = inputStream.read(response);
//                    System.out.println("Received " + bytesRead + " bytes from device.");
//
//                    // Call handleDeviceResponse to process the response
//                    handleDeviceResponse(response);
////                }
//
//                Thread.sleep(500); // small delay to avoid CPU over-utilization
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    private byte[] buildConnectCommand() {
//        final int CMD_CONNECT = 0x03e8; // 1000 (Connect command)
//        final int SESSION_ID = 0;       // Initial session ID is 0
//        final int REPLY_ID = 0;
//
//        byte[] payload = new byte[0]; // No payload for connect
//
//        int length = 8 + payload.length;
//        ByteBuffer buffer = ByteBuffer.allocate(length);
//        buffer.order(ByteOrder.LITTLE_ENDIAN);
//
//        // Command (2 bytes)
//        buffer.putShort((short) CMD_CONNECT);
//
//        // Checksum (2 bytes) - temporarily 0, will update later
//        int checksumIndex = buffer.position();
//        buffer.putShort((short) 0);
//
//        // Session ID (2 bytes)
//        buffer.putShort((short) SESSION_ID);
//
//        // Reply ID (2 bytes)
//        buffer.putShort((short) REPLY_ID);
//
//        // Append payload (none for connect)
//        buffer.put(payload);
//
//        // Calculate checksum over entire buffer
//        byte[] packet = buffer.array();
//        short checksum = calculateChecksum(packet);
//
//        // Put checksum into buffer
//        ByteBuffer.wrap(packet).order(ByteOrder.LITTLE_ENDIAN).putShort(checksumIndex, checksum);
//
//        return packet;
//    }
//
//    private short calculateChecksum(byte[] packet) {
//        int checksum = 0;
//        for (int i = 0; i < packet.length; i += 2) {
//            int part = (i + 1 < packet.length)
//                    ? (packet[i] & 0xFF) + ((packet[i + 1] & 0xFF) << 8)
//                    : (packet[i] & 0xFF);
//            checksum += part;
//        }
//        checksum &= 0xFFFF; // Keep it within 16 bits
//        return (short) checksum;
//    }
//
//    private void handleDeviceResponse(byte[] response) {
//        try {
//            // Example of a response packet: we need to extract user info and fingerprint template
//            // Assume the packet structure is something like:
//            // [User ID (4 bytes)][Fingerprint Template Size (2 bytes)][Fingerprint Template (size bytes)]
//
//            if (response.length < 6) return; // Invalid packet, too short
//
//            // Extract User ID (assume 4 bytes)
//            int userId = ByteBuffer.wrap(response, 0, 4).getInt();
//
//            // Extract Fingerprint Template Size (assume 2 bytes)
//            int templateSize = ByteBuffer.wrap(response, 4, 2).getShort();
//
//            // Extract Fingerprint Template
//            byte[] fingerprintTemplate = Arrays.copyOfRange(response, 6, 6 + templateSize);
//
//            // Get the user info, assuming you have a way to map userId to user name
////            String userName = getUserInfoById(userId);
////
////            // Now save to database
////            saveFingerprintToDatabase(userId, userName, fingerprintTemplate);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//
//}

