import React, { useEffect } from 'react';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { getUserData } from '../features/auth/authSlice';

function SideBar({ user, onClick }) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user || user.twitches.length == 0) {
      removeSideBarContainer();
      return hideSideBar();
    }
    if (user && user.twitches.length > 0) {
      addSideBarContainer();
      return showSideBar();
    }
  }, [user]);

  useEffect(() => {
    dispatch(getUserData())
  },[])

  const toggleSideBar = () => {
    let sidebar = document.getElementById('mySideBar');
    let main = document.getElementById('main');
    sidebar.classList.toggle('sidebar-opened');
    main.classList.toggle('main-opened');
  };

  const toggleCollapse = () => {
    let toggleCollapseBtn = document.getElementById('toggleCollapseBtn');
    let toggleOpenBtn = document.getElementById('toggleOpenBtn');
    let toggleMessage = document.getElementById('toggleMessage');
    toggleCollapseBtn.classList.toggle('hidden');
    toggleOpenBtn.classList.toggle('hidden');
    toggleMessage.classList.toggle('hidden');
    toggleSideBar();
  };

  const resetSideBar = () => {
    let sidebar = document.getElementById('mySideBar');
    let main = document.getElementById('main');
    let toggleCollapseBtn = document.getElementById('toggleCollapseBtn');
    let toggleOpenBtn = document.getElementById('toggleOpenBtn');
    let toggleMessage = document.getElementById('toggleMessage');
    sidebar.classList.remove('sidebar-opened');
    main.classList.remove('main-opened');
    toggleMessage.classList.add('hidden');
    toggleCollapseBtn.classList.add('hidden');
    toggleOpenBtn.classList.remove('hidden');
  };

  const addSideBarContainer = () => {
    document.getElementById('main').classList.add('main-collapsed');
  };
  const removeSideBarContainer = () => {
    document.getElementById('main').classList.remove('main-collapsed');
  };
  const showSideBar = () => {
    document.getElementById('mySideBar').classList.remove('hidden');
  };
  const hideSideBar = () => {
    resetSideBar();
    document.getElementById('mySideBar').classList.add('hidden');
  };

  return (
    <section className="sidebar-collapsed" id="mySideBar">
      <div className="toggle-collapse-container">
        <div className="toggle-message hidden" id="toggleMessage">
          Followed Channels
        </div>
        <div className="toggle-collapse-btn toggle-btn hidden" id="toggleCollapseBtn">
          <BsArrowBarLeft size={'1.5rem'} onClick={toggleCollapse} />
        </div>
      </div>
      <div className="toggle-open-container">
        <div className="toggle-open-btn toggle-btn" id="toggleOpenBtn">
          <BsArrowBarRight size={'1.5rem'} onClick={toggleCollapse} />
        </div>
      </div>
      <article className="sidebar-content">
        <ul className='sidebar-list'>
          {user?.twitches.map((twitch) => (
            <li className='sidebar-item' key={twitch._id}>
              <img className='sidebar-thumbnail' src={twitch.image_url} alt='Twitch Image Thumbnail' />
              <a className='sidebar-link' href="/" id='sideBarLink' >
                {twitch.name}
              </a>
              <button className='sidebar-remove-btn' onClick={onClick} data-remove={twitch._id}><IoMdClose className='sidebar-remove-icon' /></button>
            </li>
          )) || ''}
        </ul>
      </article>
    </section>
  );
}

export default SideBar;
