import React from 'react';
import FbIcon from '../common/FbIcon';
import InstaIcon from '../common/InstaIcon';
import TwitterIcon from '../common/TwitterIcon';
import LinkedinIcon from '../common/LinkedinIcon';

const Footer = ({ content }) => {
  return (
    <div className="bg-black text-white py-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-start">
          {/* Logo and Description Section */}
          <div className="flex flex-col w-1/5 items-center text-center mt-8">
            <p className="text-3xl mb-5">GigaMart</p>
            <p className="text-sm leading-6 text-gray-300">
              Empowering Your Work and Play <br />
              Laptops and Desktops for Every Need!
            </p>
          </div>

          {/* Dynamic Content Sections */}
          <div className="flex justify-between w-2/5">
            {content?.items &&
              content?.items?.map((item, index) => (
                <div className="flex flex-col" key={index}>
                  <p className="font-semibold text-[16px] pb-4">{item?.title}</p>
                  {item?.list &&
                    item?.list?.map((listItem, idx) => (
                      <a
                        key={idx}
                        className="text-sm py-1 text-gray-400 hover:text-white hover:underline"
                        href={listItem?.path}
                      >
                        {listItem?.label}
                      </a>
                    ))}
                </div>
              ))}
          </div>

          {/* Location Section (Google Map) */}
          <div className="flex flex-col w-1/5 items-center">
            <p className="font-semibold text-[16px] pb-4">Location</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.287193732921!2d79.912978474087!3d6.9754031930253335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2597c8dde7e47%3A0x341e7e820c46d3ed!2sUniversity%20of%20Kelaniya!5e0!3m2!1sen!2slk!4v1736680080586!5m2!1sen!2slk"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex gap-4 items-center justify-center py-6">
          <a
            href="/fb"
            className="transition transform hover:scale-110"
            style={{ color: 'gray' }}
          >
            <FbIcon className="fill-current hover:fill-white" />
          </a>
          <a
            href="/insta"
            className="transition transform hover:scale-110"
            style={{ color: 'gray' }}
          >
            <InstaIcon className="fill-current hover:fill-white" />
          </a>
          <a
            href="/twitter"
            className="transition transform hover:scale-110"
            style={{ color: 'gray' }}
          >
            <TwitterIcon className="fill-current hover:fill-white" />
          </a>
          <a
            href="/linkedin"
            className="transition transform hover:scale-110"
            style={{ color: 'gray' }}
          >
            <LinkedinIcon className="fill-current hover:fill-white" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-center text-gray-500">
          {content?.copyright}
        </p>
      </div>
    </div>
  );
};

export default Footer;
