/**
 * ObjectModel.js
 */
(function(window) {

  /**
   * コンストラクタ
   *
   * @param {String} arg1 引数１
   */
  var ObjectModel = function(bucketName) {

    /*
     * public
     */
    this.public_property = arg1;

    /*
     * private
     */
    var _bucketName = bucketName;

    /**
     * privateメソッド
     */
    var _private_method = function() {
      console.log('private method');
    };

    /**
     * public method
     */
    this.set = function(value) {
      

      
      _private_property = value;
    };
    // - - - - - - - - - - - - - - - - -
  }

  /**
   * publicメソッド（privateメンバにアクセスできない）
   */
  Foo.prototype.public_method_nonaccess = function() {
    console.log('public method');
  };
 
  /*
   * 定数A
   */
  Foo.prototype.CONSTANT_A = '定数A';

  /*
   * staticプロパティ
   */
  Foo.static_property = 'hoge hoge hoge';

  /**
   * staticメソッド
   */
  Foo.method_1 = function() {
    console.log('static method');
  };

  window.Foo = Foo;

 }(window));