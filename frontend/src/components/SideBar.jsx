import React, { useEffect } from 'react';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../features/auth/authSlice';
import { getTwitch, unsaveTwitch } from '../features/twitches/twitchSlice';

function SideBar() {
  // sidebar helper functions
  const removeSideBar = () => {
    document.getElementById('main').classList.remove('main-collapsed');
    document.getElementById('main').classList.remove('main-opened');
    document.getElementById('mySideBar').classList.remove('sidebar-opened');
    document.getElementById('mySideBar').classList.add('hidden');
  };
  const addSideBar = () => {
    document.getElementById('main').classList.add('main-collapsed');
    document.getElementById('mySideBar').classList.remove('sidebar-opened');
    document.getElementById('mySideBar').classList.remove('hidden');
    document.getElementById('toggleOpenContainer').classList.remove('hidden');
    document.getElementById('toggleCollapseContainer').classList.add('hidden');
    addListItems();
  };
  // iterate through sidebar list items to add/toggle class
  const addListItems = () => {
    for (let i = 0; i < document.querySelectorAll('#sidebarList>li').length; i++) {
      document.querySelectorAll('#sidebarList>li>a')[i].classList.add('hidden');
      document.querySelectorAll('#sidebarList>li>button')[i].classList.add('hidden');
      document.querySelectorAll('#sidebarList>li')[i].classList.add('sidebar-item-collapsed');
      document.querySelectorAll('#sidebarList>li>img')[i].classList.add('sidebar-thumbnail-collapsed');
    }
  };
  const toggleListItems = () => {
    for (let i = 0; i < document.querySelectorAll('#sidebarList>li').length; i++) {
      document.querySelectorAll('#sidebarList>li>a')[i].classList.toggle('hidden');
      document.querySelectorAll('#sidebarList>li>button')[i].classList.toggle('hidden');
      document.querySelectorAll('#sidebarList>li')[i].classList.toggle('sidebar-item-collapsed');
      document.querySelectorAll('#sidebarList>li>img')[i].classList.toggle('sidebar-thumbnail-collapsed');
    }
  };

  // store reusable sidebar elements
  let sidebar = document.getElementById('mySideBar');
  let main = document.getElementById('main');
  let toggleCollapseContainer = document.getElementById('toggleCollapseContainer')
  let toggleOpenContainer = document.getElementById('toggleOpenContainer');
  
  // handle onclick for toggling collapse
  const toggleCollapse = () => {
    sidebar.classList.toggle('sidebar-opened');
    main.classList.toggle('main-opened');
    toggleCollapseContainer.classList.toggle('hidden');
    toggleOpenContainer.classList.toggle('hidden');
    toggleListItems();
  };

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth)
  const { saved } = useSelector(state => state.twitches)

  // fetch user data
  useEffect(() => {
    if (user) {
      dispatch(getUserData());
    }
  }, [saved]);
  
  // set state of sidebar contingent on user data
  useEffect(() => {
    if(!user) {
      removeSideBar();
    }
    if (user?.twitches.length === 0) {
      removeSideBar();
    }
    if (user && user?.twitches.length > 0) {
      addSideBar();
    }
  }, [user]);

  // handle unsaving profile from sidebar
  const handleUnsave = (e) => {
    const removeId = e.target.dataset.remove
    dispatch(unsaveTwitch(removeId));
  };

  return (
    <section className="sidebar-collapsed" id="mySideBar">
      <div className="toggle-collapse-container hidden" id='toggleCollapseContainer'>
        <div className="toggle-message" id="sidebarMessage">
          Followed Channels
        </div>
        <div
          className="toggle-collapse-btn toggle-btn"
          id="sidebarCollapseBtn"
        >
          <BsArrowBarLeft size={'1.5rem'} onClick={toggleCollapse} />
        </div>
      </div>
      <div className="toggle-open-container" id='toggleOpenContainer'>
        <div className="toggle-open-btn toggle-btn" id="sidebarOpenBtn">
          <BsArrowBarRight size={'1.5rem'} onClick={toggleCollapse} />
        </div>
      </div>
      <article className="sidebar-content">
        <ul className="sidebar-list" id="sidebarList">
          {user?.twitches.map((twitch) => (
            <li className="sidebar-item sidebar-item-collapsed" key={twitch._id}>
              <img
                className="sidebar-thumbnail sidebar-thumbnail-collapsed"
                src={twitch.image_url}
                alt="Twitch Image Thumbnail"
                draggable={false}
                onClick={() => {
                  dispatch(getTwitch({ name: twitch.name }));
                }}
              />
              <a
                className="sidebar-link hidden"
                href="#"
                id="sideBarLink"
                onClick={() => {
                  dispatch(getTwitch({ name: twitch.name }));
                }}
              >
                {twitch.name}
              </a>
              <button
                className="sidebar-remove-btn hidden"
                id="sideBarRemoveBtn"
                onClick={handleUnsave}
                data-remove={twitch._id}
              >
                <IoMdClose className="sidebar-remove-icon" />
              </button>
            </li>
          )) || ''}
        </ul>
      </article>
    </section>
  );
}

export default SideBar;
