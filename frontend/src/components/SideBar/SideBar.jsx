import React, { useEffect } from 'react';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../features/auth/authSlice';
import { getTwitch, unsaveTwitch } from '../../features/twitches/twitchSlice';
import './SideBar.css';

function SideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { saved } = useSelector((state) => state.twitches);
  // fetch user data when saved changes
  useEffect(() => {
    if (saved.length !== 0) {
      dispatch(getUserData());
    }
  }, [saved]);
  // sidebar effects
  useEffect(() => {
    // store variables only accessible after DOM renders
    let sidebar = document.getElementById('mySideBar');
    let main = document.getElementById('main');
    let toggleOpenContainer = document.getElementById('toggleOpenContainer');
    let toggleCollapseContainer = document.getElementById(
      'toggleCollapseContainer',
    );
    let sidebarListItems = document.querySelectorAll('#sidebarList>li');
    let sidebarImg = document.querySelectorAll('#sidebarList>li>img');
    let sideBarLink = document.querySelectorAll('#sidebarList>li>a');
    let sideBarRemoveBtn = document.querySelectorAll('#sidebarList>li>button');
    // sidebar helper functions
    const removeSideBar = () => {
      main.classList.remove('main-collapsed');
      main.classList.remove('main-opened');
      sidebar.classList.remove('sidebar-opened');
      sidebar.classList.add('hidden');
    };
    const addSideBar = () => {
      main.classList.remove('main-opened');
      main.classList.add('main-collapsed');
      sidebar.classList.remove('sidebar-opened');
      sidebar.classList.remove('hidden');
      toggleOpenContainer.classList.remove('hidden');
      toggleCollapseContainer.classList.add('hidden');
      addListItems();
    };
    // iterate through sidebar list items to add class
    const addListItems = () => {
      for (let i = 0; i < sidebarListItems.length; i++) {
        sidebarListItems[i].classList.add('sidebar-item-collapsed');
        sidebarImg[i].classList.add('sidebar-thumbnail-collapsed');
        sideBarLink[i].classList.add('hidden');
        sideBarRemoveBtn[i].classList.add('hidden');
      }
    };
    // set state of sidebar contingent on user data
    if (!user) {
      removeSideBar();
    }
    if (user?.twitches.length === 0) {
      removeSideBar();
    }
    if (user && user?.twitches.length > 0) {
      addSideBar();
    }
  }, [user]);
  // handle onclick for toggle collapse button
  const toggleCollapse = () => {
    document.getElementById('mySideBar').classList.toggle('sidebar-opened');
    document.getElementById('main').classList.toggle('main-opened');
    document
      .getElementById('toggleCollapseContainer')
      .classList.toggle('hidden');
    document.getElementById('toggleOpenContainer').classList.toggle('hidden');
    toggleListItems();
  };
  // iterate through sidebar list items to toggle class
  const toggleListItems = () => {
    for (
      let i = 0;
      i < document.querySelectorAll('#sidebarList>li').length;
      i++
    ) {
      document
        .querySelectorAll('#sidebarList>li>a')
        [i].classList.toggle('hidden');
      document
        .querySelectorAll('#sidebarList>li>button')
        [i].classList.toggle('hidden');
      document
        .querySelectorAll('#sidebarList>li')
        [i].classList.toggle('sidebar-item-collapsed');
      document
        .querySelectorAll('#sidebarList>li>img')
        [i].classList.toggle('sidebar-thumbnail-collapsed');
    }
  };
  // handle unsaving profile from sidebar
  const handleUnsave = (e) => {
    const removeId = e.target.dataset.remove;
    dispatch(unsaveTwitch(removeId));
  };

  return (
    <section className="sidebar-collapsed" id="mySideBar">
      <div
        className="toggle-collapse-container hidden"
        id="toggleCollapseContainer"
      >
        <div className="toggle-message" id="sidebarMessage">
          Followed Channels
        </div>
        <div className="toggle-collapse-btn toggle-btn" id="sidebarCollapseBtn">
          <BsArrowBarLeft size={'1.5rem'} onClick={toggleCollapse} />
        </div>
      </div>
      <div className="toggle-open-container" id="toggleOpenContainer">
        <div className="toggle-open-btn toggle-btn" id="sidebarOpenBtn">
          <BsArrowBarRight size={'1.5rem'} onClick={toggleCollapse} />
        </div>
      </div>
      <div className="custom-toggle-container">
        <input type="checkbox" id="customToggle" />
      </div>
      <article className="sidebar-content">
        <ul className="sidebar-list" id="sidebarList">
          {user?.twitches.map((twitch) => (
            <li
              className="sidebar-item sidebar-item-collapsed"
              key={twitch._id}
            >
              <img
                className="sidebar-thumbnail sidebar-thumbnail-collapsed"
                src={twitch.image_url}
                alt="Twitch Image Thumbnail"
                draggable={false}
                onClick={() => {
                  dispatch(getTwitch({ name: twitch.name }));
                  navigate('/twitchdashboard');
                }}
              />
              <a
                className="sidebar-link hidden"
                href="#"
                id="sideBarLink"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(getTwitch({ name: twitch.name }));
                  navigate('/twitchdashboard');
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
