import React from 'react'
import Title from '../components/Title'

const PrivacyPolicy = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'PRIVACY'} text2={'POLICY'} />
      </div>
      <div className='mt-6 text-gray-600 space-y-6'>
        <p>
          This Privacy Policy explains how CampusCart collects, uses, and protects
          your information when you use our website and services.
        </p>

        <div>
          <h3 className='text-lg font-semibold text-gray-800'>Information We Collect</h3>
          <ul className='list-disc pl-6 mt-2'>
            <li>Account details such as name and email address.</li>
            <li>Order and wishlist activity to provide personalized features.</li>
            <li>Basic device and usage data for analytics and security.</li>
          </ul>
        </div>

        <div>
          <h3 className='text-lg font-semibold text-gray-800'>How We Use Information</h3>
          <ul className='list-disc pl-6 mt-2'>
            <li>Process orders, payments, and delivery updates.</li>
            <li>Improve product discovery and website performance.</li>
            <li>Communicate important service or policy updates.</li>
          </ul>
        </div>

        <div>
          <h3 className='text-lg font-semibold text-gray-800'>Data Sharing</h3>
          <p className='mt-2'>
            We do not sell your personal data. We only share data with trusted
            service providers required to operate the platform (such as payment
            or delivery partners).
          </p>
        </div>

        <div>
          <h3 className='text-lg font-semibold text-gray-800'>Your Choices</h3>
          <ul className='list-disc pl-6 mt-2'>
            <li>Update your profile information from the account page.</li>
            <li>Request deletion of your account by contacting support.</li>
            <li>Opt out of non-essential communications at any time.</li>
          </ul>
        </div>

        <div>
          <h3 className='text-lg font-semibold text-gray-800'>Contact</h3>
          <p className='mt-2'>
            If you have questions about this policy, please contact us at
            campuscart.project@gmail.com.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
