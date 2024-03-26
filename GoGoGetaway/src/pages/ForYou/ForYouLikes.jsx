import React, { useState } from 'react';
import {
  FaRegHeart,
  FaHeart,
  FaShare,
  FaRegCommentAlt,
  FaCommentAlt,
  FaTimes,
} from 'react-icons/fa';
import axios from 'axios'; // Make sure to install axios with npm or yarn
import { FaRegBookmark, FaBookmark } from 'react-icons/fa6';
import { Input } from '@/components/ui/input';
import { set } from 'date-fns';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/userContext';
import Comment from './Comment';
export default function ForYouLikes({
  isMobile,
  itinerariesProp,
  index,
  iconSize,
}) {
  const [itineraries, setItineraries] = useState(
    itinerariesProp.map((itinerary) => ({
      ...itinerary,
      liked: false, // Initialize all itineraries as not liked
    })),
  );
  console.log(itineraries);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(false);
  const { currentUser } = useUserContext();

  const handleLikeButton = async (itineraryId, index) => {
    const itinerary = itineraries[index];
    console.log(itineraryId);
    const newLikedState = !itinerary.liked; // Toggle the liked state
    const likeChange = newLikedState ? 1 : -1; // Increment if liking, decrement if unliking
    const userId = currentUser.id;
    // Optimistically update the UI
    const newItineraries = [...itineraries];
    newItineraries[index] = {
      ...itinerary,
      likeCount: itinerary.likeCount + likeChange,
      liked: newLikedState,
    };
    setItineraries(newItineraries);

    try {
      // Send the request to the server to increment or decrement the like count
      const endpoint = newLikedState
        ? `http://localhost:8080/itineraries/increment-like/${itineraryId}`
        : `http://localhost:8080/itineraries/decrement-like/${itineraryId}`; // Assume you have a decrement-like endpoint
      await axios.post(endpoint);

      const addToLikedEndpoint = `http://localhost:8080/users/${userId}/add-to-liked`;
      await axios.post(addToLikedEndpoint, {
        itineraryId: itineraryId,
      });
    } catch (error) {
      console.error('Error updating like count:', error);
      // Optionally, revert the optimistic update here
    }
  };

  const openComments = async (itineraryId) => {
    setComment('');
    try {
      // Fetch comments for the itinerary
      const response = await fetch(
        `http://localhost:8080/itineraries/${itineraryId}/comments`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const comments = await response.json();
      setComments(comments);
    } catch (error) {
      console.error('Error opening comments:', error);
      // Handle error appropriately, such as displaying an error message
    }
  };

  const submitComment = async (itineraryId, comment) => {
    // add the comment to the comments array
    try {
      // Send the comment to the server
      const response = await fetch(
        `http://localhost:8080/itineraries/${itineraryId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: comment, userId: currentUser.id }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      // Extract the newly added comment from the response
      const newComment = await response.json();

      // Update the comments state to include the newly added comment
      setComments((prevComments) => [...prevComments, newComment]);

      console.log('Comment submitted successfully');

      //Get itenerary for itineraryId
      const itinerary = itineraries.find(
        (itinerary) => itinerary.id === itineraryId,
      );
      //Increment comment count
      itinerary.commentCount++;

      setItineraries([...itineraries]);

      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Handle error appropriately, such as displaying an error message
    }
  };

  return (
    <div className="h-70 absolute bottom-40 right-6 z-10 mb-12 flex flex-col gap-6 rounded-xl  bg-white/60 px-2 py-4 text-sm sm:mb-8 sm:ml-4 sm:text-lg lg:static lg:right-16 lg:bg-transparent">
      <div className="flex flex-col items-center gap-2">
        <img
          src={itineraries[index].userPhoto}
          className="mb-5 w-[4rem] rounded-full"
        />
        {itineraries[index].liked ? (
          <FaHeart
            size={iconSize}
            className="ease cursor-pointer text-rose-500 transition duration-200 hover:text-rose-500"
            onClick={() => handleLikeButton(itineraries[index].id, index)}
          />
        ) : (
          <FaRegHeart
            size={iconSize}
            className="ease cursor-pointer text-rose-500 transition duration-200 hover:text-rose-500"
            onClick={() => handleLikeButton(itineraries[index].id, index)}
          />
        )}

        <div className=" font-bold">{itineraries[index].likeCount}</div>
      </div>
      <div className="flex flex-col items-center gap-2">
        {
          <Drawer>
            <DrawerTrigger>
              <FaRegCommentAlt
                size={iconSize}
                onClick={() => openComments(itineraries[index].id)}
              />
            </DrawerTrigger>
            <DrawerContent className="h-4/6 lg:w-1/2 lg:justify-self-center">
              <DrawerHeader className="flex items-center gap-4">
                <DrawerClose className="text-xl">
                  <FaTimes />
                </DrawerClose>
                <DrawerTitle className="justify-self-center text-3xl">
                  Comments
                </DrawerTitle>
              </DrawerHeader>
              <div className="grid grid-cols-1 gap-y-6 overflow-scroll p-4">
                {comments ? (
                  comments.map((comment, index) => (
                    <Comment key={index} comment={comment} />
                  ))
                ) : (
                  <div>Loading comments...</div>
                )}
              </div>
              <DrawerFooter className="flex flex-row items-center">
                <Input
                  className="border-slate-500"
                  placeholder="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  className="h-full w-1/4"
                  onClick={() => submitComment(itineraries[index].id, comment)}
                >
                  Comment
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        }
        <div className=" font-bold">{itineraries[index].commentCount}</div>
      </div>
      {/* <div className="flex flex-col items-center gap-2">
        <FaRegBookmark size={iconSize} />
 
      </div> */}
    </div>
  );
}
