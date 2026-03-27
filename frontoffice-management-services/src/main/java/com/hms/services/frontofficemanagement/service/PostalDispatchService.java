package com.hms.services.frontofficemanagement.service;


import com.hms.services.frontofficemanagement.model.PostalDispatch;

import java.util.List;
import java.util.UUID;


public interface PostalDispatchService {

    public PostalDispatch createPostalDispatch(PostalDispatch postalDispatchDto);

    List<PostalDispatch> getAllPostalDispatchs();

    PostalDispatch getPostalDispatchById(UUID id);

    PostalDispatch updatePostalDispatch(UUID id, PostalDispatch postalDispatchDto);

    Boolean deletePostalDispatchById(UUID id);
}


