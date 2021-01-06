
import React, {useEffect, useState } from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  Platform,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import NotFound from '../../components/NotFound'
import ListRecords from '../../components/business/ListRecords'
import Loading from '../../components/Loading'


const Record = () => {
  const [ infoUser, setInfoUser] = useState(null)
  const [totalPlans, setTotalPlans] = useState(0)
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [startPlans, setStartPlans] = useState(null)
  const [showFooter, setShowFooter] = useState(false)  
  const [isLoading, setIsLoading] = useState(false)  
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const limitPlans = 12

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    getUserInfo()
    .then(user => {
      if (user) {
        getData(user)
      }
      
    })   
    
  }, []);

  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem('token')
    const apiUser = `https://salsantiago-api.herokuapp.com/me`
    const resultUser = await fetch(apiUser, {
                headers: {
                    'authorization': token,
                },
            })
    let { user, ok, err } = await resultUser.json()
            
    if(ok) {
      setInfoUser(user)
      return user
    }else {
       return null
    }
    
  }


  const getData = async (user) => {
    setLoadingText('Cargando Registros...')
    setLoading(true)
    const token = await AsyncStorage.getItem('token')
     
    const apiPlans = `https://salsantiago-api.herokuapp.com/plans/${user._id}?from=0&limit=${limitPlans}`
    const resultPlans = await fetch(apiPlans, {
                headers: {
                    'authorization': token,
                },
            })
    let plansData = await resultPlans.json()

    if( plansData.ok ) {
        let newDataList = plansData.obj.map((item) => {
            item.isExpanded = false
            return item
        })
        setFilteredDataSource(newDataList);
        setMasterDataSource(newDataList);
        setTotalPlans(plansData.total)
        setStartPlans(plansData.arrayLength)
        setLoading(false)
    } else {
        setFilteredDataSource([]);
        setMasterDataSource([]);
        setLoading(false)
    }
  }

  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...filteredDataSource];
    
      // If single select is enabled
      array.map((value, placeindex) =>
        placeindex === index
          ? (array[placeindex]['isExpanded'] =
             !array[placeindex]['isExpanded'])
          : (array[placeindex]['isExpanded'] = false),
      );
    
    setFilteredDataSource(array);
  };

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
       
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.course_id.description
          ? item.course_id.description.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const handleLoadMore = async () => {
    setShowFooter(true)
    masterDataSource.length < totalPlans && setIsLoading(true)
   
    const token = await AsyncStorage.getItem('token')     
    const apiPlans = `https://salsantiago-api.herokuapp.com/plans/${infoUser._id}?from=${startPlans}&limit=${limitPlans}`
    const resultPlans = await fetch(apiPlans, {
                headers: {
                    'authorization': token,
                },
            })
    let plansData = await resultPlans.json()

    if( plansData.ok ) {
      let newDataList = plansData.obj.map((item) => {
          item.isExpanded = false
          return item
      })
      setFilteredDataSource([...filteredDataSource, ...newDataList]);
      setMasterDataSource([...masterDataSource, ...newDataList]);
      setTotalPlans(plansData.total)
      setStartPlans(startPlans + plansData.arrayLength)
      setIsLoading(false)
      masterDataSource.length < totalPlans && setShowFooter(false)
    } else {
      setIsLoading(false)
    }
  }


  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <SearchBar
            round
            searchIcon={{size: 24}}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            placeholder="Curso..."
            value={search}
            />

        {
            filteredDataSource.length === 0 ? (
                <NotFound />
            ) : (
                <>
                <View style={{flexDirection: 'row', padding: 10, backgroundColor: '#bdbdbd'}}>
                    <Text style={styles.titleTextLeft}>Plan</Text>  
                    <Text style={styles.titleTextRight}>Fecha Ingreso</Text>             
                </View>
                <ScrollView
                  onScrollEndDrag={ handleLoadMore }
                >
                {filteredDataSource.map((item, key) => (
                    <ListRecords

                    key={item._id}
                    onClickFunction={() => {
                        updateLayout(key);
                    }}
                    item={item}
                    />
                    
                ))}
                </ScrollView>
                {
                  showFooter && <FooterList isLoading={ isLoading }/>
                }
                </>
            )
        }
      <Loading text={loadingText} isVisible={loading} />
      </View>
    </SafeAreaView>
  );
};

export default Record;

function FooterList(props) {
  const { isLoading } = props

  if(isLoading) {
      return (
          <View style={ styles.loaderPlans}>
              <ActivityIndicator size='large' color="#0000ff"/>
          </View>
      )
  } else {
      return (
          <View style={ styles.notFoundPlans }>
              <Text>No quedan registros por cargar</Text>
          </View>
      )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  titleTextLeft: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  titleTextRight: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  iconLeft: {
    color: "#c1c1c1",
  },
  loaderPlans: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  notFoundPlans: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
});
