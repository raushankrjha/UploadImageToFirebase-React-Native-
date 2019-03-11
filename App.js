import * as React from 'react';
import {  View, StyleSheet,Text,TouchableOpacity } from 'react-native';
import { Constants,ImagePicker } from 'expo';

import * as firebase from 'firebase';
import uuid from 'uuid';


  //init firebase
  const firebaseconfig=
  {
     apiKey: "AIzaSyCqvf6pvtRc0A7vZ4oIqldzb1VKB5LxJ2k",
      authDomain: "fir-authwithreactnative.firebaseapp.com",
      databaseURL: "https://fir-authwithreactnative.firebaseio.com",
      projectId: "fir-authwithreactnative",
      storageBucket: "fir-authwithreactnative.appspot.com",
      messagingSenderId: "887313025101"
  };
  firebase.initializeApp(firebaseconfig);
  

// You can import from local files
 class App extends React.Component {

  constructor(props)
  {
    super(props)
    this.state =
    ({ 
  
     image: null,
  
     })
  }


   _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
  
    this._handleImagePicked(pickerResult);
  };
  
  
  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });
  
      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
        alert('Upload Success');
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };


  


  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
      <TouchableOpacity style={styles.button} 
          onPress={this._pickImage}
        >
        <Text style={{ fontSize: 15,
           fontStyle:'italic',
           textAlign:'center',
           color:"white"}}
         >Choose Image</Text>
       </TouchableOpacity>
      
        

      </View>
    );
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  button:
  {
    
    width:'90%',
  margin:15,
    paddingTop:15,
    paddingBottom:15,
  
    borderRadius:7,
    borderWidth: 0,
    borderColor: '#fff',
    backgroundColor:'#C93263',

  }
   
 
});


//upload image to storage

async function uploadImageAsync(uri) {
  
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child("PostImages").child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();
    const url=snapshot.ref.getDownloadURL();
  return await snapshot.ref.getDownloadURL();
}
