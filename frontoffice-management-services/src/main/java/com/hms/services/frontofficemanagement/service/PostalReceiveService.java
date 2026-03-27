package com.hms.services.frontofficemanagement.service;


import com.hms.services.frontofficemanagement.model.PostalReceive;

import java.util.List;
import java.util.UUID;


public interface PostalReceiveService {

    public PostalReceive createPostalReceive(PostalReceive postalReceiveDto);

    List<PostalReceive> getAllPostalReceives();

    PostalReceive getPostalReceiveById(UUID id);

    PostalReceive updatePostalReceive(UUID id, PostalReceive postalReceiveDto);

    Boolean deletePostalReceiveById(UUID id);
}


