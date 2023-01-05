import React, { useRef, useState } from 'react'
import { CButton, CCheckboxGroup, CDatePicker, CForm, CInput, CRadioGroup, CSelect } from '@casual-ui/react'
import SpaceItems from '../theme/components/SpaceItems'
export default function Demo() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthday: null,
    displayBirthday: '',
    industry: '',
    hobbies: [],
  })

  const setField = (k, v) =>
    setFormData({
      ...formData,
      [k]: v,
    })

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]

  const industryOptions = [
    { label: 'IT', value: 'IT' },
    { label: 'Medical', value: 'Medical' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Transportation', value: 'Transportation' },
  ]

  const items = [
    {
      label: 'Name',
      field: 'name',
      rules: [v => (v ? false : 'Please enter Name')],
      children: (
        <CInput
          value={formData.name}
          onChange={v => setField('name', v)}
          placeholder="Please enter Name"
        />
      ),
    },
    {
      label: 'Gender',
      field: 'gender',
      rules: [
        (v) => {
          return v === 'male' ? false : 'Can only be Male!'
        },
      ],
      children: (
        <CRadioGroup
          value={formData.gender}
          options={genderOptions}
          onChange={v => setField('gender', v)}
        />
      ),
    },
    {
      label: 'Birthday',
      field: 'birthday',
      rules: [v => (!v ? ' Please select Birthday' : false)],
      children: (
        <CDatePicker
          format="MMM DD, YYYY"
          value={formData.birthday}
          placeholder=" Please select Birthday"
          onChange={v => setField('birthday', v)}
          formattedValue={formData.displayBirthday}
          onFormattedValueChange={v => setField('displayBirthday', v)}
        />
      ),
    },
    {
      label: 'Industry',
      field: 'industry',
      rules: [
        v =>
          !v
            ? 'Please select industry'
            : (v !== 'IT' && v !== 'Entertainment')
                ? 'Can only be IT or Entertainment!'
                : false,
      ],
      children: (
        <CSelect
          value={formData.industry}
          placeholder="Select industry"
          onChange={v => setField('industry', v)}
          options={industryOptions}
        />
      ),
    },
    {
      label: 'Hobbies',
      field: 'hobbies',
      rules: [v => (v && v.length < 2 ? 'At lease two hobbies' : false)],
      children: (
        <CCheckboxGroup
          value={formData.hobbies}
          onChange={v => setField('hobbies', v)}
          options={['Reading', 'Writing', 'Singing', 'Dancing'].map(h => ({
            label: h,
            value: h,
          }))}
        />
      ),
    },
  ]

  const formRef = useRef(null)

  return (
    <div className="c-pa-md">
      <CForm
        ref={formRef}
        value={formData}
        items={items}
      />
      <div className="c-mt-xl">
        <SpaceItems>
          <CButton
            outlined
            label="Reset"
            onClick={() => formRef.current.clearAll()}
          />
          <CButton
            label="Submit"
            onClick={() => formRef.current.validateAll()}
          />
        </SpaceItems>
      </div>
    </div>
  )
}
