import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import TwitchItem from './TwitchItem';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';

function SideBar() {
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if(!user) {
      return hideSideBar()
    }
    if(user && user.twitches.length > 0) {
      addSideBarContainer()
      return showSideBar()
    }
    return hideSideBar()
  }, [user]);

  const toggleSideBar = () => {
    let sidebar = document.getElementById('mySideBar');
    let main = document.getElementById('main');
    sidebar.classList.toggle('sidebar');
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

  const addSideBarContainer = () => {
    document.getElementById('main').classList.add('main-collapsed')
  }
  const showSideBar = () => {
    document.getElementById('mySideBar').classList.remove('hidden')
  }
  const hideSideBar = () => {
    document.getElementById('mySideBar').classList.add('hidden')
  }

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
      <article className="content">
        <ul>
          {user?.twitches.length > 0 ? ( 
            user.twitches.map(twitch => <li key={twitch._id}><a href="">{twitch.name}</a></li>)
          ) : ('')}
        </ul>
      </article>
    </section>
  );
}

export default SideBar;
