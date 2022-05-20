import React, { useEffect, useState } from 'react';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../features/auth/authSlice';
import { getTwitch } from '../features/twitches/twitchSlice';

function SideBar() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth)
  const [hasSideBar, setHasSideBar] = useState('');
  const [favorites, setFavorites] = useState(user?.twitches);

  // fetch user data
  useEffect(() => {
    dispatch(getUserData());
  }, []);

  // set state of sidebar contingent on user data
  useEffect(() => {
    setFavorites(user?.twitches);

    if (user && favorites.length === 0) {
      setHasSideBar(false);
    }
    if (user && favorites.length > 0) {
      setHasSideBar(true);
    }
  }, [user, favorites]);

  // handle sidebar visibility
  useEffect(() => {
    if (hasSideBar) {
      addSideBar();
    }
    if (!hasSideBar) {
      removeSideBar();
    }
  }, [hasSideBar]);

  // sidebar visibilty helper functions
  const removeSideBar = () => {
    document.getElementById('main').classList.remove('main-collapsed');
    document.getElementById('mySideBar').classList.add('hidden');
  };
  const addSideBar = () => {
    document.getElementById('main').classList.add('main-collapsed');
    document.getElementById('mySideBar').classList.remove('hidden');
  };

  // store sidebar elements
  let sidebar = document.getElementById('mySideBar');
  let main = document.getElementById('main');
  let sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
  let sidebarOpenBtn = document.getElementById('sidebarOpenBtn');
  let sidebarMessage = document.getElementById('sidebarMessage');
  let sidebarItems = document.querySelectorAll('#sidebarList>li');
  let sidebarLinks = document.querySelectorAll('#sidebarList>li>a');
  let sidebarRemoveBtns = document.querySelectorAll('#sidebarList>li>button');
  let sidebarImgs = document.querySelectorAll('#sidebarList>li>img');

  // iterate through sidebar list items to toggle class
  const toggleListItems = () => {
    for (let i = 0; i < sidebarLinks.length; i++) {
      sidebarLinks[i].classList.toggle('hidden');
      sidebarRemoveBtns[i].classList.toggle('hidden');
      sidebarItems[i].classList.toggle('sidebar-item-collapsed');
      sidebarImgs[i].classList.toggle('sidebar-thumbnail-collapsed');
    }
  };

  // handle onclick for toggling collapse
  const toggleCollapse = () => {
    sidebar.classList.toggle('sidebar-opened');
    main.classList.toggle('main-opened');
    sidebarCollapseBtn.classList.toggle('hidden');
    sidebarOpenBtn.classList.toggle('hidden');
    sidebarMessage.classList.toggle('hidden');
    toggleListItems();
  };

  const handleUnsave = (e) => {
    const removeId = e.target.dataset.remove
    dispatch(unsaveTwitch(removeId));
  };

  return (
    <section className="sidebar-collapsed" id="mySideBar">
      <div className="toggle-collapse-container">
        <div className="toggle-message hidden" id="sidebarMessage">
          Followed Channels
        </div>
        <div
          className="toggle-collapse-btn toggle-btn hidden"
          id="sidebarCollapseBtn"
        >
          <BsArrowBarLeft size={'1.5rem'} onClick={toggleCollapse} />
        </div>
      </div>
      <div className="toggle-open-container">
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
