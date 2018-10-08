```javascript
import YXFilter from '../../components/filter'

const conditions = [
  {
    title: { name: '视频分类', key: '视频分类' },
    content: [
      { name: '全部', key: '全部' },
      { name: '综艺', key: '综艺' },
      { name: '电影', key: '电影' },
      { name: '教育', key: '教育' },
      { name: '动漫', key: '动漫' },
      { name: '电视剧', key: '电视剧' },
    ],
    activeKey: '全部'
  },
]

const callback = (typeKey, optionKey) => {
  console.log(typeKey) // output `视频分类`
  console.log(optionKey) // output `综艺`
}

<YXFilter conditions={conditions} callback={callback}/>

```
